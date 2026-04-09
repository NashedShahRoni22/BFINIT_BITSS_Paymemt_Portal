export function formatPrice(value) {
  if (value == null || isNaN(value)) return "";

  return Number.isInteger(value)
    ? value.toString()
    : parseFloat(value).toFixed(2);
}
