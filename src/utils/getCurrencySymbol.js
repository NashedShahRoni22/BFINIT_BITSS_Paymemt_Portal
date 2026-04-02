const defaultCurrency = "৳";

export const getCurrencySymbol = (currencyIcon) => {
  if (!currencyIcon) {
    return defaultCurrency;
  }

  const doc = new DOMParser().parseFromString(currencyIcon, "text/html");
  return doc.documentElement.textContent;
};
