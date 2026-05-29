export const formatAddress = (address) => {
  if (!address) return "-";

  if (typeof address === "string") return address;

  return [
    address.house,
    address.street,
    address.dist,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
};
