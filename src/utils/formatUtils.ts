
// Helper function to parse currency input (allows comma and dot)
export const parseCurrencyInput = (value: string): string => {
  if (!value) return '0';

  // If the value is a valid number format (digits and optional dot, no commas), 
  // treat it as a number string (e.g. from DB or US format input)
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return value;
  }

  // Otherwise, assume BR format:
  // 1. Remove thousands separators (dots)
  const valueWithoutDots = value.replace(/\./g, '');
  // 2. Replace decimal separator (comma) with dot
  const valueWithDot = valueWithoutDots.replace(',', '.');
  // 3. Remove any remaining non-numeric characters except the dot
  const cleanValue = valueWithDot.replace(/[^0-9.-]/g, '');
  
  return cleanValue;
};

// Helper function to display currency value in input
export const formatCurrencyInput = (value: string): string => {
  return value;
};
