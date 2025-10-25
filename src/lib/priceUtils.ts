export const formatPrice = (
  price: number,
  currency: string,
  exchangeRate?: number | null
): { original: string; converted?: string } => {
  const formattedPrice = new Intl.NumberFormat("ru-RU").format(price);
  const original = `${formattedPrice} ${currency}`;

  // If currency is already KGS or no exchange rate provided, return only original
  if (currency === "KGS" || !exchangeRate) {
    return { original };
  }

  // Convert to KGS
  const kgsPrice = price * exchangeRate;
  const formattedKgsPrice = new Intl.NumberFormat("ru-RU").format(
    Math.round(kgsPrice)
  );
  const converted = `${formattedKgsPrice} KGS`;

  return { original, converted };
};

export const formatPriceDisplay = (
  price: number,
  currency: string,
  exchangeRate?: number | null
): string => {
  const { original, converted } = formatPrice(price, currency, exchangeRate);
  if (!converted) {
    return original;
  }
  return `${original} (${converted})`;
};
