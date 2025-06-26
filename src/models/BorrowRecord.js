import { v4 as uuidv4 } from 'uuid';

class BorrowRecord {
  constructor(userId, bookId, dueDate = null) {
    this.id = uuidv4();
    this.userId = userId;
    this.bookId = bookId;
    this.borrowDate = new Date().toISOString();
    this.dueDate = dueDate || this.calculateDueDate();
    this.returnDate = null;
    this.status = 'active';
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  calculateDueDate() {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days from now
    return dueDate.toISOString();
  }

  static validate(borrowData) {
    const errors = [];

    if (!borrowData.userId || borrowData.userId.trim().length === 0) {
      errors.push('User ID is required');
    }

    if (!borrowData.bookId || borrowData.bookId.trim().length === 0) {
      errors.push('Book ID is required');
    }

    // Due date validation
    if (borrowData.dueDate) {
      const dueDate = new Date(borrowData.dueDate);
      const today = new Date();
      if (dueDate <= today) {
        errors.push('Due date must be in the future');
      }
    }

    return errors;
  }

  returnBook() {
    this.returnDate = new Date().toISOString();
    this.status = 'returned';
    this.updatedAt = new Date().toISOString();
  }

  markOverdue() {
    this.status = 'overdue';
    this.updatedAt = new Date().toISOString();
  }

  isOverdue() {
    if (this.status === 'returned') return false;
    const now = new Date();
    const dueDate = new Date(this.dueDate);
    return now > dueDate;
  }

  update(updateData) {
    if (updateData.dueDate !== undefined) this.dueDate = updateData.dueDate;
    if (updateData.status !== undefined) this.status = updateData.status;
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      bookId: this.bookId,
      borrowDate: this.borrowDate,
      dueDate: this.dueDate,
      returnDate: this.returnDate,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default BorrowRecord;
