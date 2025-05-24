/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text - The input text to truncate
 * @param maxLength - Maximum allowed length before truncation
 * @returns Truncated text with ellipsis if truncated
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
