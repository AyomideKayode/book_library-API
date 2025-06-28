import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
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
    biography: {
      type: String,
      trim: true,
      maxlength: [2000, 'Biography cannot exceed 2000 characters'],
    },
    birthDate: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow null/undefined
          return v <= new Date();
        },
        message: 'Birth date cannot be in the future',
      },
    },
    nationality: {
      type: String,
      trim: true,
      maxlength: [50, 'Nationality cannot exceed 50 characters'],
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow empty
          return /^https?:\/\/.+/.test(v);
        },
        message:
          'Website must be a valid URL starting with http:// or https://',
      },
    },
    awards: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        year: {
          type: Number,
          min: 1900,
          max: new Date().getFullYear(),
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    socialMedia: {
      twitter: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            if (!v) return true;
            return /^@?\w{1,15}$/.test(v);
          },
          message: 'Invalid Twitter handle',
        },
      },
      facebook: String,
      instagram: String,
      linkedin: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
authorSchema.index({ name: 'text', biography: 'text' }); // Text search
authorSchema.index({ nationality: 1 });
authorSchema.index({ birthDate: 1 });

// Virtual for books by this author
authorSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'authorId',
});

// Virtual for author's age
authorSchema.virtual('age').get(function () {
  if (!this.birthDate) return null;
  const today = new Date();
  const birth = new Date(this.birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware
authorSchema.pre('save', function (next) {
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }

  // Clean up social media handles
  if (this.socialMedia?.twitter && !this.socialMedia.twitter.startsWith('@')) {
    this.socialMedia.twitter = '@' + this.socialMedia.twitter;
  }

  next();
});

// Static method to find authors by nationality
authorSchema.statics.findByNationality = function (nationality) {
  return this.find({ nationality: new RegExp(nationality, 'i') });
};

// Static method to find living authors
authorSchema.statics.findLiving = function () {
  const currentYear = new Date().getFullYear();
  return this.find({
    $or: [{ deathDate: { $exists: false } }, { deathDate: null }],
  });
};

// Instance method to get full info with books
authorSchema.methods.getFullInfo = function () {
  return this.populate('books');
};

const Author = mongoose.model('Author', authorSchema);

export default Author;
