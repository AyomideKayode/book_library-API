import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow empty phone
          // International phone number format
          return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ''));
        },
        message: 'Invalid phone number format',
      },
    },
    membershipDate: {
      type: Date,
      default: Date.now,
      // index: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'Nigeria',
      },
    },
    preferences: {
      favoriteGenres: [
        {
          type: String,
          trim: true,
        },
      ],
      language: {
        type: String,
        default: 'English',
        trim: true,
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
        reminders: {
          type: Boolean,
          default: true,
        },
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    libraryCard: {
      number: {
        type: String,
        unique: true,
        sparse: true, // Allow multiple null values
      },
      issuedDate: Date,
      expiryDate: Date,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
userSchema.index({ name: 'text' }); // Text search
userSchema.index({ membershipDate: 1 });
// userSchema.index({ 'libraryCard.number': 1 });
userSchema.index({ status: 1, membershipDate: 1 }); // Compound index

// Virtual for borrow records
userSchema.virtual('borrowRecords', {
  ref: 'BorrowRecord',
  localField: '_id',
  foreignField: 'userId',
});

// Virtual for active borrows
userSchema.virtual('activeBorrows', {
  ref: 'BorrowRecord',
  localField: '_id',
  foreignField: 'userId',
  match: { status: 'active' },
});

// Virtual for membership duration
userSchema.virtual('membershipDuration').get(function () {
  const now = new Date();
  const membershipDate = new Date(this.membershipDate);
  const diffTime = Math.abs(now - membershipDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for full address
userSchema.virtual('fullAddress').get(function () {
  if (!this.address) return null;
  const { street, city, state, zipCode, country } = this.address;
  return [street, city, state, zipCode, country].filter(Boolean).join(', ');
});

// Pre-save middleware
userSchema.pre('save', function (next) {
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }

  // Generate library card number if not exists
  if (!this.libraryCard?.number && this.isNew) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.libraryCard = {
      number: `LIB${year}${random}`,
      issuedDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    };
  }

  next();
});

// Static method to find active users
userSchema.statics.findActive = function () {
  return this.find({ status: 'active' });
};

// Static method to find users by membership year
userSchema.statics.findByMembershipYear = function (year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);
  return this.find({
    membershipDate: {
      $gte: startDate,
      $lt: endDate,
    },
  });
};

// Instance method to check if user can borrow
userSchema.methods.canBorrow = async function () {
  const activeBorrows = await mongoose.model('BorrowRecord').countDocuments({
    userId: this._id,
    status: 'active',
  });
  return this.status === 'active' && activeBorrows < 5; // Max 5 books at a time
};

// Instance method to get user's borrowing history
userSchema.methods.getBorrowHistory = function () {
  return this.populate('borrowRecords');
};

const User = mongoose.model('User', userSchema);

export default User;
