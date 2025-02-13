export const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'Date not available';
  return new Date(date).toLocaleDateString();
};
