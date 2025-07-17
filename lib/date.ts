export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    month: 'short',
    day: '2-digit',
    year: '2-digit',
  })
}
