// Centralized contact information
export const CONTACT_INFO = {
  phone: '+34 635 252 706',
  address: 'Vía Trajana, 11, 1-1, 08020 Sant Adrià de Besòs, Barcelona',
  email: 'adpbonpastor@gmail.com',
  socialMedia: {
    youtube: 'https://www.youtube.com/@adbompastorbcn',
    instagram: 'https://www.instagram.com/adbonpastor_bcn/',
    facebook: 'https://www.facebook.com/AdBonBarcelona/'
  }
};

// Document validation patterns
export const DOCUMENT_PATTERNS = {
  passport: /^[A-Z0-9]{6,9}$/i, // Letters and numbers, 6-9 characters
  nie: /^[XYZ][0-9]{7}[A-Z]$/i, // Letter + 7 numbers + letter
  dni: /^[0-9]{8}[A-Z]$/i // 8 numbers + letter
};

// Document validation function
export const validateDocument = (type: string, value: string): boolean => {
  if (!value) return true; // Optional field
  
  switch (type) {
    case 'passport':
      return DOCUMENT_PATTERNS.passport.test(value);
    case 'nie':
      return DOCUMENT_PATTERNS.nie.test(value);
    case 'dni':
      return DOCUMENT_PATTERNS.dni.test(value);
    default:
      return true;
  }
};

// Payment method options
export const PAYMENT_METHODS = [
  { value: 'credit_debit_card', label: 'Cartão de crédito/débito' },
  { value: 'bizum', label: 'Bizum' },
  { value: 'cash', label: 'Dinheiro' }
];