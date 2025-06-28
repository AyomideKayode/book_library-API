import User from '../models/User.js';
import mongoose from 'mongoose';

class UserService {
  async findAll(filters = {}) {
    const query = {};

    // Search filter
    if (filters.q) {
      query.$or = [
        { name: { $regex: filters.q, $options: 'i' } },
        { email: { $regex: filters.q, $options: 'i' } },
        { phone: { $regex: filters.q, $options: 'i' } },
        { 'libraryCard.number': { $regex: filters.q, $options: 'i' } },
      ];
    }

    // Status filter
    if (filters.status) {
      query.status = filters.status;
    }

    // Membership year filter
    if (filters.membershipYear) {
      const year = parseInt(filters.membershipYear);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);
      query.membershipDate = { $gte: startDate, $lt: endDate };
    }

    // Sorting
    let sort = { name: 1 };
    if (filters.sort) {
      const field = filters.sort.replace('-', '');
      const order = filters.sort.startsWith('-') ? -1 : 1;
      sort = { [field]: order };
    }

    // Pagination
    const page = parseInt(filters.page) > 0 ? parseInt(filters.page) : 1;
    const limit = parseInt(filters.limit) > 0 ? parseInt(filters.limit) : 10;
    const skip = (page - 1) * limit;

    const [users, totalItems] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('borrowRecords')
        .lean(),
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
        hasNext: skip + users.length < totalItems,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return User.findById(id).populate('borrowRecords').lean();
  }

  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() }).lean();
  }

  async findByLibraryCard(cardNumber) {
    return User.findOne({ 'libraryCard.number': cardNumber }).lean();
  }

  async create(userData) {
    // Check if email already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const user = await User.create(userData);
    return user.toObject();
  }

  async update(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid user ID');
      error.statusCode = 400;
      error.code = 'INVALID_ID';
      throw error;
    }

    // Check if email is being updated and already exists
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email.toLowerCase(),
        _id: { $ne: id },
      });
      if (existingUser) {
        const error = new Error('User with this email already exists');
        error.statusCode = 409;
        error.code = 'EMAIL_EXISTS';
        throw error;
      }
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('borrowRecords');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return user.toObject();
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid user ID');
      error.statusCode = 400;
      error.code = 'INVALID_ID';
      throw error;
    }

    // Check if user has active borrows
    const BorrowRecord = mongoose.model('BorrowRecord');
    const activeBorrows = await BorrowRecord.countDocuments({
      userId: id,
      status: 'active',
    });

    if (activeBorrows > 0) {
      const error = new Error('Cannot delete user with active borrows');
      error.statusCode = 409;
      error.code = 'USER_HAS_ACTIVE_BORROWS';
      throw error;
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return user.toObject();
  }

  async getStats() {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });

    // Membership statistics by year
    const membershipStatsArr = await User.aggregate([
      {
        $group: {
          _id: { $year: '$membershipDate' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const membershipStats = {};
    membershipStatsArr.forEach((m) => {
      membershipStats[m._id] = m.count;
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      membershipByYear: membershipStats,
    };
  }

  async updateStatus(id, status) {
    return this.update(id, { status });
  }

  async renewLibraryCard(id) {
    const user = await User.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const newExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
    user.libraryCard.expiryDate = newExpiryDate;

    await user.save();
    return user.toObject();
  }
}

export default new UserService();
