export const SELLER_ID_KEY = "sellerId";

export function getSellerId() {
  const storedId = localStorage.getItem(SELLER_ID_KEY);
  return storedId ? Number(storedId) : 1;
}
