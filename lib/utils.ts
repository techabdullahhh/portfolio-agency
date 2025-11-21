import slugify from "slugify";

export const buildSlug = (value: string) =>
  slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });

export const parseCsvToArray = (value?: string | null) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export const arrayToCsv = (values: string[]) => values.filter(Boolean).join(", ");

export const ensureArray = (value: unknown) => {
  if (Array.isArray(value)) return value;
  if (!value) return [] as string[];
  if (typeof value === "string") return parseCsvToArray(value);
  return [] as string[];
};

