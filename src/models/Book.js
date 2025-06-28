import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Author is required'],
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          // ISBN-10 or ISBN-13 validation
          const isbn10Regex = /^(?:\d{9}X|\d{10})$/;
          const isbn13Regex = /^(?:97[89]\d{10})$/;
          const cleanIsbn = v.replace(/[-\s]/g, '');
          return isbn10Regex.test(cleanIsbn) || isbn13Regex.test(cleanIsbn);
        },
        message: 'Invalid ISBN format. Must be a valid ISBN-10 or ISBN-13',
      },
      index: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
      maxlength: [50, 'Genre cannot exceed 50 characters'],
    },
    publicationDate: {
      type: Date,
      required: [true, 'Publication date is required'],
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: 'Publication date cannot be in the future',
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    pages: {
      type: Number,
      min: [1, 'Pages must be at least 1'],
      max: [10000, 'Pages cannot exceed 10000'],
    },
    language: {
      type: String,
      default: 'English',
      trim: true,
      maxlength: [30, 'Language cannot exceed 30 characters'],
    },
    publisher: {
      type: String,
      trim: true,
      maxlength: [100, 'Publisher cannot exceed 100 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
bookSchema.index({ title: 'text', description: 'text' }); // Text search
bookSchema.index({ authorId: 1, available: 1 }); // Compound index
bookSchema.index({ genre: 1, available: 1 }); // Compound index

// Virtual for author population
bookSchema.virtual('author', {
  ref: 'Author',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for borrow records
bookSchema.virtual('borrowRecords', {
  ref: 'BorrowRecord',
  localField: '_id',
  foreignField: 'bookId',
});

// Pre-save middleware to format ISBN
bookSchema.pre('save', function (next) {
  if (this.isbn) {
    // Remove hyphens and spaces from ISBN
    this.isbn = this.isbn.replace(/[-\s]/g, '');
  }
  next();
});

// Static method to find available books
bookSchema.statics.findAvailable = function () {
  return this.find({ available: true });
};

// Instance method to check if book is available
bookSchema.methods.isAvailable = function () {
  return this.available;
};

// Instance method to toggle availability
bookSchema.methods.toggleAvailability = function () {
  this.available = !this.available;
  return this.save();
};

const Book = mongoose.model('Book', bookSchema);

export default Book;
