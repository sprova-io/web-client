export function validateNotEmpty(text: string) {
  return text.length > 0 ? 'success' : 'error';
}
