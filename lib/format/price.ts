/**
 * Formats a plain numeric string (dot-decimal, e.g. "1234.5") using
 * Venezuelan conventions: "." as the thousands separator, "," as the
 * decimal separator.
 */
export function formatPriceDisplay(value: string): string {
  if (!value) return "";
  const [integerPart, decimalPart] = value.split(".");
  const integerDigits = integerPart.replace(/\D/g, "");
  const grouped = integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimalPart !== undefined ? `${grouped},${decimalPart}` : grouped;
}

/**
 * Takes whatever the user just typed into a masked price input (which may
 * already contain "."-thousands separators from a previous formatting pass)
 * and returns both the re-formatted display text and the canonical numeric
 * string (dot-decimal, no thousands separators) to store in form state.
 */
export function parsePriceKeystroke(raw: string): { display: string; numeric: string } {
  const hasComma = raw.includes(",");
  const [integerRaw, decimalRaw = ""] = raw.split(",");
  const integerDigits = integerRaw.replace(/\D/g, "");
  const decimalDigits = decimalRaw.replace(/\D/g, "").slice(0, 2);

  const numeric = decimalDigits ? `${integerDigits || "0"}.${decimalDigits}` : integerDigits;

  const groupedInteger = integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const display = hasComma ? `${groupedInteger},${decimalDigits}` : groupedInteger;

  return { display, numeric };
}
