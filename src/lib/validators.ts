/**
 * Validation utilities for Role-Based Authentication System
 * Provides validation functions for AISHE codes, passwords, emails, and phone numbers
 */

// ============================================================
// TypeScript Interfaces
// ============================================================

export interface PasswordValidation {
  valid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
}

export interface EmailValidation {
  valid: boolean;
  isCollegeEmail: boolean;
  suggestion?: string;
}

export interface PhoneValidation {
  valid: boolean;
  formatted: string;
  error?: string;
}

// ============================================================
// AISHE Code Validation
// ============================================================

/**
 * Validates AISHE code format (C-XXXXX where X is a digit)
 * @param code - AISHE code to validate
 * @returns true if format is valid, false otherwise
 */
export function validateAisheCodeFormat(code: string): boolean {
  if (!code) return false;
  
  // Format: C-XXXXX (case-insensitive)
  const aisheRegex = /^[Cc]-[0-9]{5}$/;
  return aisheRegex.test(code);
}

// ============================================================
// Password Validation
// ============================================================

/**
 * Validates password strength and returns detailed feedback
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
 * 
 * @param password - Password to validate
 * @returns PasswordValidation object with validity, strength, and errors
 */
export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push('Must be at least 8 characters long');
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain at least one uppercase letter');
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain at least one lowercase letter');
  }
  
  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('Must contain at least one number');
  }
  
  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    errors.push('Must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }
  
  // Determine validity
  const valid = errors.length === 0;
  
  // Calculate strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (valid) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
    
    const characterTypes = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (password.length >= 12 && characterTypes === 4) {
      strength = 'strong';
    } else if (password.length >= 10 && characterTypes >= 3) {
      strength = 'medium';
    } else {
      strength = 'weak';
    }
  }
  
  return {
    valid,
    strength,
    errors
  };
}

// ============================================================
// Email Validation
// ============================================================

/**
 * Validates email format and checks if it's a college email
 * @param email - Email address to validate
 * @returns EmailValidation object with validity and college email status
 */
export function validateEmail(email: string): EmailValidation {
  if (!email) {
    return {
      valid: false,
      isCollegeEmail: false
    };
  }
  
  // Standard email format validation (RFC 5322 simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = emailRegex.test(email);
  
  if (!valid) {
    return {
      valid: false,
      isCollegeEmail: false
    };
  }
  
  // Check if it's a college email (.edu.in or .ac.in)
  const isCollegeEmail = email.endsWith('.edu.in') || email.endsWith('.ac.in');
  
  // Provide suggestion if not a college email
  const suggestion = !isCollegeEmail 
    ? 'We recommend using your college email address' 
    : undefined;
  
  return {
    valid,
    isCollegeEmail,
    suggestion
  };
}

// ============================================================
// Phone Number Validation
// ============================================================

/**
 * Validates Indian mobile phone numbers
 * Format: 10 digits starting with 6, 7, 8, or 9
 * Accepts optional +91 country code prefix
 * Removes spaces, hyphens, and parentheses before validation
 * 
 * @param phone - Phone number to validate
 * @returns PhoneValidation object with validity, formatted number, and error
 */
export function validatePhoneNumber(phone: string): PhoneValidation {
  if (!phone) {
    return {
      valid: false,
      formatted: '',
      error: 'Phone number is required'
    };
  }
  
  // Remove spaces, hyphens, parentheses, and +91 prefix
  let cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Remove +91 or 91 prefix if present
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  }
  
  // Validate format: exactly 10 digits starting with 6, 7, 8, or 9
  const phoneRegex = /^[6-9][0-9]{9}$/;
  
  if (!phoneRegex.test(cleaned)) {
    return {
      valid: false,
      formatted: cleaned,
      error: 'Invalid phone number. Please enter a 10-digit Indian mobile number starting with 6, 7, 8, or 9'
    };
  }
  
  return {
    valid: true,
    formatted: cleaned,
    error: undefined
  };
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Checks if two passwords match
 * @param password - First password
 * @param confirmPassword - Second password to compare
 * @returns true if passwords match, false otherwise
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}

/**
 * Validates a full name (2-100 characters, letters and spaces only)
 * @param name - Full name to validate
 * @returns true if valid, false otherwise
 */
export function validateFullName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 100) {
    return false;
  }
  
  // Allow letters (including Unicode for Indian names), spaces, and common punctuation
  const nameRegex = /^[a-zA-Z\u0900-\u097F\s.''-]+$/;
  return nameRegex.test(name);
}

/**
 * Validates a department name
 * @param department - Department name to validate
 * @returns true if valid, false otherwise
 */
export function validateDepartment(department: string): boolean {
  if (!department || department.length < 2 || department.length > 100) {
    return false;
  }
  
  return true;
}

/**
 * Validates a roll number (alphanumeric, 1-20 characters)
 * @param rollNumber - Roll number to validate
 * @returns true if valid, false otherwise
 */
export function validateRollNumber(rollNumber: string): boolean {
  if (!rollNumber || rollNumber.length < 1 || rollNumber.length > 20) {
    return false;
  }
  
  // Allow alphanumeric characters, hyphens, and slashes
  const rollNumberRegex = /^[a-zA-Z0-9\-/]+$/;
  return rollNumberRegex.test(rollNumber);
}

// ============================================================
// Aliases for backward compatibility
// ============================================================

/**
 * Alias for validateAisheCodeFormat (for backward compatibility)
 */
export const validateAisheCode = validateAisheCodeFormat;

/**
 * Alias for validatePhoneNumber (for backward compatibility)
 */
export const validatePhone = validatePhoneNumber;
