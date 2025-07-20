export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    month: 'short',
    day: '2-digit',
    year: '2-digit',
  })
}
