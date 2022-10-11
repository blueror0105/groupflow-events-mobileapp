export function decodeDate(date?: string): Date | null {
  if (!date) return null;
  const dateOnly = date.match(/^(\d+)-(\d+)-(\d+)$/);
  if (dateOnly) {
    const year = parseInt(dateOnly[1]);
    const month = parseInt(dateOnly[2]);
    const day = parseInt(dateOnly[3]);
    return new Date(year, month - 1, day, 0, 0, 0);
  }
  return new Date(date);
}
