import { v4 as uuidv4 } from 'uuid';

class User {
  constructor(name, email, phone = null) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.membershipDate = new Date().toISOString().split('T')[0]; // Today's date
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static validate(userData) {
    const errors = [];

    if (!userData.name || userData.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!userData.email || userData.email.trim().length === 0) {
      errors.push('Email is required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userData.email && !emailRegex.test(userData.email)) {
      errors.push('Invalid email format');
    }

    // Phone format validation (optional)
    if (userData.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(userData.phone.replace(/[\s\-\(\)]/g, ''))) {
        errors.push('Invalid phone number format');
      }
    }

    return errors;
  }

  update(updateData) {
    if (updateData.name !== undefined) this.name = updateData.name;
    if (updateData.email !== undefined) this.email = updateData.email;
    if (updateData.phone !== undefined) this.phone = updateData.phone;
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      membershipDate: this.membershipDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default User;
