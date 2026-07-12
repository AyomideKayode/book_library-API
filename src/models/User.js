import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ''));
        },
        message: 'Invalid phone number format',
      },
    },
    membershipDate: {
      type: Date,
      default: Date.now,
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
        sparse: true,
      },
      issuedDate: Date,
      expiryDate: Date,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ name: 'text' });
userSchema.index({ membershipDate: 1 });
userSchema.index({ status: 1, membershipDate: 1 });

userSchema.virtual('borrowRecords', {
  ref: 'BorrowRecord',
  localField: '_id',
  foreignField: 'userId',
});

userSchema.virtual('activeBorrows', {
  ref: 'BorrowRecord',
  localField: '_id',
  foreignField: 'userId',
  match: { status: 'active' },
});

userSchema.virtual('membershipDuration').get(function () {
  const now = new Date();
  const membershipDate = new Date(this.membershipDate);
  const diffTime = Math.abs(now - membershipDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

userSchema.virtual('fullAddress').get(function () {
  if (!this.address) return null;
  const { street, city, state, zipCode, country } = this.address;
  return [street, city, state, zipCode, country].filter(Boolean).join(', ');
});

userSchema.pre('save', async function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }

  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (!this.libraryCard?.number && this.isNew) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.libraryCard = {
      number: `LIB${year}${random}`,
      issuedDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
  }

  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.findActive = function () {
  return this.find({ status: 'active' });
};

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

userSchema.methods.canBorrow = async function () {
  const activeBorrows = await mongoose.model('BorrowRecord').countDocuments({
    userId: this._id,
    status: 'active',
  });
  return this.status === 'active' && activeBorrows < 5;
};

userSchema.methods.getBorrowHistory = function () {
  return this.populate('borrowRecords');
};

const User = mongoose.model('User', userSchema);

export default User;
