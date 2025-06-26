import User from '../models/User.js';

class UserService {
  constructor() {
    this.users = new Map();
    this.initializeData();
  }

  initializeData() {
    // Sample data for demonstration
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-123-4567',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-987-6543',
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: null,
      },
    ];

    sampleUsers.forEach((userData) => {
      const user = new User(userData.name, userData.email, userData.phone);
      this.users.set(user.id, user);
    });
  }

  async findAll(filters = {}) {
    let users = Array.from(this.users.values());

    // Apply filters
    if (filters.q) {
      const query = filters.q.toLowerCase();
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.phone && user.phone.toLowerCase().includes(query))
      );
    }

    // Sort
    if (filters.sort) {
      const sortField = filters.sort.startsWith('-')
        ? filters.sort.slice(1)
        : filters.sort;
      const sortOrder = filters.sort.startsWith('-') ? -1 : 1;

      users.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    } else {
      // Default sort by name
      users.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedUsers = users.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(users.length / limit),
        totalItems: users.length,
        itemsPerPage: limit,
        hasNext: endIndex < users.length,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id) {
    return this.users.get(id) || null;
  }

  async findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  async create(userData) {
    // Check if email already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw {
        statusCode: 409,
        message: 'User with this email already exists',
        code: 'EMAIL_EXISTS',
      };
    }

    const user = new User(userData.name, userData.email, userData.phone);

    this.users.set(user.id, user);
    return user;
  }

  async update(id, updateData) {
    const user = this.users.get(id);
    if (!user) {
      throw {
        statusCode: 404,
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      };
    }

    // Check if email is being updated and already exists
    if (
      updateData.email &&
      updateData.email.toLowerCase() !== user.email.toLowerCase()
    ) {
      const existingUser = await this.findByEmail(updateData.email);
      if (existingUser) {
        throw {
          statusCode: 409,
          message: 'User with this email already exists',
          code: 'EMAIL_EXISTS',
        };
      }
    }

    user.update(updateData);
    this.users.set(id, user);
    return user;
  }

  async delete(id) {
    const user = this.users.get(id);
    if (!user) {
      throw {
        statusCode: 404,
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      };
    }

    this.users.delete(id);
    return user;
  }

  async getStats() {
    const users = Array.from(this.users.values());

    return {
      totalUsers: users.length,
    };
  }
}

export default new UserService();
