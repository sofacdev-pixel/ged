export const slugify = (s: string) => {
  let slug = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  if (/^\d/.test(slug)) {
    slug = `sec-${slug}`; // prepend something if it starts with a digit
  }
  return slug;
};
