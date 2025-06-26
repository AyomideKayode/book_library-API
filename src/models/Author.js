import { v4 as uuidv4 } from 'uuid';

class Author {
  constructor(name, email, biography = null, birthDate = null) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.biography = biography;
    this.birthDate = birthDate;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static validate(authorData) {
    const errors = [];

    if (!authorData.name || authorData.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!authorData.email || authorData.email.trim().length === 0) {
      errors.push('Email is required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (authorData.email && !emailRegex.test(authorData.email)) {
      errors.push('Invalid email format');
    }

    // Birth date validation
    if (authorData.birthDate) {
      const birthDate = new Date(authorData.birthDate);
      const today = new Date();
      if (birthDate > today) {
        errors.push('Birth date cannot be in the future');
      }
    }

    return errors;
  }

  update(updateData) {
    if (updateData.name !== undefined) this.name = updateData.name;
    if (updateData.email !== undefined) this.email = updateData.email;
    if (updateData.biography !== undefined)
      this.biography = updateData.biography;
    if (updateData.birthDate !== undefined)
      this.birthDate = updateData.birthDate;
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      biography: this.biography,
      birthDate: this.birthDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Author;
