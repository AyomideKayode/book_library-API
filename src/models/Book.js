import { v4 as uuidv4 } from 'uuid';

class Book {
  constructor(title, authorId, isbn, genre, publicationDate = null) {
    this.id = uuidv4();
    this.title = title;
    this.authorId = authorId;
    this.isbn = isbn;
    this.genre = genre;
    this.publicationDate = publicationDate;
    this.available = true;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static validate(bookData) {
    const errors = [];

    if (!bookData.title || bookData.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!bookData.authorId || bookData.authorId.trim().length === 0) {
      errors.push('Author ID is required');
    }

    if (!bookData.isbn || bookData.isbn.trim().length === 0) {
      errors.push('ISBN is required');
    }

    if (!bookData.genre || bookData.genre.trim().length === 0) {
      errors.push('Genre is required');
    }

    // ISBN format validation (simplified)
    if (
      bookData.isbn &&
      !/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(
        bookData.isbn.replace(/[- ]/g, '')
      )
    ) {
      errors.push('Invalid ISBN format');
    }

    return errors;
  }

  update(updateData) {
    if (updateData.title !== undefined) this.title = updateData.title;
    if (updateData.authorId !== undefined) this.authorId = updateData.authorId;
    if (updateData.isbn !== undefined) this.isbn = updateData.isbn;
    if (updateData.genre !== undefined) this.genre = updateData.genre;
    if (updateData.publicationDate !== undefined)
      this.publicationDate = updateData.publicationDate;
    if (updateData.available !== undefined)
      this.available = updateData.available;
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      authorId: this.authorId,
      isbn: this.isbn,
      genre: this.genre,
      publicationDate: this.publicationDate,
      available: this.available,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Book;
