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

/**
 * Format invoice item remarks based on item type
 * @param item - The invoice item object
 * @returns Formatted remarks string
 */
export const formatInvoiceItemRemarks = (item: {
  item_type_code?: string;
  remarks?: string | null;
  company_name?: string;
  spare_name?: string;
  model_name?: string;
  account_name?: string;
  account_number?: string;
}): string => {
  if (!item.item_type_code) return "-";

  switch (item.item_type_code) {
    case "DISCOUNT":
      return item.item_type_code;
    case "WORK":
      return item.remarks || "-";
    case "COMMISSION":
      const parts = ["Commission"];
      if (item.remarks) parts.push(item.remarks);
      if (item.account_name) parts.push(item.account_name);
      else if (item.account_number) parts.push(item.account_number);
      return parts.length > 1 ? parts.join("-") : (item.remarks || "-");
    case "SPARE":
      const spareParts = [];
      if (item.company_name) spareParts.push(item.company_name);
      if (item.spare_name) spareParts.push(item.spare_name);
      if (item.model_name) spareParts.push(`(${item.model_name})`);
      return spareParts.length > 0 ? spareParts.join("-") : "-";
    default:
      return item.remarks || "-";
  }
};
