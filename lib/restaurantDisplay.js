// Small helpers to turn raw Google-Places-style fields into readable text.

const PRICE_LEVEL_TO_SYMBOL = {
  PRICE_LEVEL_FREE: "Free",
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};

export function formatPriceLevel(priceLevel) {
  return PRICE_LEVEL_TO_SYMBOL[priceLevel] ?? "?";
}

export function formatCuisine(types) {
  const primaryType = types?.[0] ?? "restaurant";
  return primaryType
    .replace(/_restaurant$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Restaurant";
}
