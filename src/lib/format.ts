const formaPrice = (price: number) => {
  return (price / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "ZAR",
  });
};

export { formaPrice };
