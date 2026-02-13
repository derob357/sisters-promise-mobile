/**
 * Login Screen Tests
 * Tests for login screen validation and logic
 */

describe('Login Screen Logic', () => {
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  describe('Email Validation', () => {
    it('should accept valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
    it('should reject invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should accept 8+ char password', () => {
      expect(validatePassword('12345678')).toBe(true);
    });
    it('should reject short password', () => {
      expect(validatePassword('1234567')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('Form validation chain', () => {
    const validate = (email, password) => {
      const e = email.trim();
      const p = password.trim();
      if (!e || !p) return 'Please fill in all fields';
      if (!validateEmail(e)) return 'Please enter a valid email address';
      if (!validatePassword(p)) return 'Password must be at least 8 characters';
      return '';
    };

    it('should catch empty fields first', () => {
      expect(validate('', '')).toBe('Please fill in all fields');
    });
    it('should catch invalid email', () => {
      expect(validate('bad', 'password123')).toBe('Please enter a valid email address');
    });
    it('should catch short password', () => {
      expect(validate('test@example.com', 'short')).toBe('Password must be at least 8 characters');
    });
    it('should pass with valid inputs', () => {
      expect(validate('test@example.com', 'password123')).toBe('');
    });
    it('should trim whitespace', () => {
      expect(validate('  test@example.com  ', '  password123  ')).toBe('');
    });
    it('should reject whitespace-only', () => {
      expect(validate('   ', '   ')).toBe('Please fill in all fields');
    });
  });
});
