export function protectString(text: string) {
  if (!text) {
    return text;
  }

  if (text.length <= 4) {
    return text.substring(0, 1) + '***';
  }

  return text.substring(0, 2) + '****' + text.substring(text.length - 2);
}

export function protectEmail(email: string) {
  if (!email) {
    return;
  }
  const splitted = email.split('@');
  return protectString(splitted[0]) + '@' + (splitted[1] ?? '');
}

export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
