import BorrowService from '../services/borrowService.js';

class BorrowController {
  async getAllBorrowRecords(req, res, next) {
    try {
      const filters = {
        userId: req.query.userId,
        bookId: req.query.bookId,
        status: req.query.status,
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort,
      };

      const result = await BorrowService.findAll(filters);

      res.status(200).json({
        success: true,
        data: result.borrowRecords,
        pagination: result.pagination,
        message: 'Borrow records retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getBorrowRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const borrowRecord = await BorrowService.findById(id);

      if (!borrowRecord) {
        return res.status(404).json({
          success: false,
          error: 'Borrow record not found',
          code: 'BORROW_NOT_FOUND',
        });
      }

      res.status(200).json({
        success: true,
        data: borrowRecord,
        message: 'Borrow record retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async borrowBook(req, res, next) {
    try {
      const borrowRecord = await BorrowService.borrowBook(req.body);

      res.status(201).json({
        success: true,
        data: borrowRecord,
        message: 'Book borrowed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async returnBook(req, res, next) {
    try {
      const { borrowId } = req.body;
      const borrowRecord = await BorrowService.returnBook(borrowId);

      res.status(200).json({
        success: true,
        data: borrowRecord,
        message: 'Book returned successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async extendDueDate(req, res, next) {
    try {
      const { id } = req.params;
      const { dueDate } = req.body;

      const borrowRecord = await BorrowService.extendDueDate(id, dueDate);

      res.status(200).json({
        success: true,
        data: borrowRecord,
        message: 'Due date extended successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserBorrowHistory(req, res, next) {
    try {
      const { userId } = req.params;
      const borrowHistory = await BorrowService.getUserBorrowHistory(userId);

      res.status(200).json({
        success: true,
        data: borrowHistory,
        message: 'User borrow history retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookBorrowHistory(req, res, next) {
    try {
      const { bookId } = req.params;
      const borrowHistory = await BorrowService.getBookBorrowHistory(bookId);

      res.status(200).json({
        success: true,
        data: borrowHistory,
        message: 'Book borrow history retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getOverdueBooks(req, res, next) {
    try {
      const overdueRecords = await BorrowService.getOverdueBooks();

      res.status(200).json({
        success: true,
        data: overdueRecords,
        message: 'Overdue books retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getBorrowStats(req, res, next) {
    try {
      const stats = await BorrowService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Borrow statistics retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BorrowController();
