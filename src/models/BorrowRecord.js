import mongoose from 'mongoose';

const borrowRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required'],
    },
    borrowDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v > this.borrowDate;
        },
        message: 'Due date must be after borrow date',
      },
    },
    returnDate: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow null
          return v >= this.borrowDate;
        },
        message: 'Return date cannot be before borrow date',
      },
    },
    status: {
      type: String,
      enum: ['active', 'returned', 'overdue', 'lost'],
      default: 'active',
      required: true,
    },
    renewalCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 3, // Maximum 3 renewals
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    fineAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finePaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for performance
borrowRecordSchema.index({ userId: 1, status: 1 });
borrowRecordSchema.index({ bookId: 1, status: 1 });
borrowRecordSchema.index({ dueDate: 1, status: 1 });
borrowRecordSchema.index({ borrowDate: 1, returnDate: 1 });

// Virtual for user population
borrowRecordSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for book population
borrowRecordSchema.virtual('book', {
  ref: 'Book',
  localField: 'bookId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for days borrowed
borrowRecordSchema.virtual('daysBorrowed').get(function () {
  const endDate = this.returnDate || new Date();
  const startDate = new Date(this.borrowDate);
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for days overdue
borrowRecordSchema.virtual('daysOverdue').get(function () {
  if (this.status === 'returned' || this.status === 'lost') return 0;
  const now = new Date();
  const dueDate = new Date(this.dueDate);
  if (now <= dueDate) return 0;
  const diffTime = now - dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for calculated fine
borrowRecordSchema.virtual('calculatedFine').get(function () {
  const daysOverdue = this.daysOverdue;
  if (daysOverdue <= 0) return 0;
  const finePerDay = 50; // 50 naira per day
  return Math.min(daysOverdue * finePerDay, 5000); // Max fine of 5000 naira
});

// Pre-save middleware
borrowRecordSchema.pre('save', function (next) {
  // Set due date if not provided (14 days from borrow date)
  if (!this.dueDate && this.borrowDate) {
    const dueDate = new Date(this.borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);
    this.dueDate = dueDate;
  }

  // Calculate fine amount based on overdue days
  if (this.status === 'overdue' && !this.finePaid) {
    this.fineAmount = this.calculatedFine;
  }

  // If book is returned, clear overdue status and set return date
  if (this.status === 'returned' && !this.returnDate) {
    this.returnDate = new Date();
  }

  next();
});

// Pre-save middleware to update book availability
borrowRecordSchema.pre('save', async function (next) {
  if (this.isModified('status')) {
    const Book = mongoose.model('Book');

    try {
      if (this.status === 'returned' || this.status === 'lost') {
        // Make book available when returned or marked as lost
        await Book.findByIdAndUpdate(this.bookId, { available: true });
      } else if (this.status === 'active') {
        // Make book unavailable when borrowed
        await Book.findByIdAndUpdate(this.bookId, { available: false });
      }
    } catch (error) {
      console.error('Error updating book availability:', error);
    }
  }
  next();
});

// Static method to find overdue records
borrowRecordSchema.statics.findOverdue = function () {
  return this.find({
    status: { $in: ['active', 'overdue'] },
    dueDate: { $lt: new Date() },
  });
};

// Static method to find records due soon (within 3 days)
borrowRecordSchema.statics.findDueSoon = function () {
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  return this.find({
    status: 'active',
    dueDate: {
      $gte: new Date(),
      $lte: threeDaysFromNow,
    },
  });
};

// Static method to update overdue records
borrowRecordSchema.statics.updateOverdueRecords = async function () {
  const overdueRecords = await this.find({
    status: 'active',
    dueDate: { $lt: new Date() },
  });

  const updatePromises = overdueRecords.map((record) => {
    record.status = 'overdue';
    return record.save();
  });

  return Promise.all(updatePromises);
};

// Instance method to renew borrow record
borrowRecordSchema.methods.renew = function (additionalDays = 14) {
  if (this.renewalCount >= 3) {
    throw new Error('Maximum renewal limit reached');
  }

  if (this.status !== 'active') {
    throw new Error('Only active borrows can be renewed');
  }

  const newDueDate = new Date(this.dueDate);
  newDueDate.setDate(newDueDate.getDate() + additionalDays);

  this.dueDate = newDueDate;
  this.renewalCount += 1;

  return this.save();
};

// Instance method to return book
borrowRecordSchema.methods.returnBook = function () {
  this.status = 'returned';
  this.returnDate = new Date();
  return this.save();
};

// Instance method to mark as lost
borrowRecordSchema.methods.markAsLost = function () {
  this.status = 'lost';
  this.fineAmount = 2000; // Fixed fine for lost books
  return this.save();
};

const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);

export default BorrowRecord;
