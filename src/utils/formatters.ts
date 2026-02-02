/**
 * Format a date string to dd/mm/yyyy format
 * @param dateString - The date string to format (ISO format)
 * @returns Formatted date string or "-" if null/undefined
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format a number or string as currency in Indian format
 * @param amount - The amount to format (string or number)
 * @returns Formatted currency string with 2 decimal places
 */
export const formatCurrency = (amount: string | number | null | undefined): string => {
  if (!amount || amount === null || amount === undefined || amount === '') {
    return '0.00';
  }
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) {
    return '0.00';
  }
  return numAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
