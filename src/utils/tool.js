const openNewWindow = (url) => {
  window.open(url, "_blank");
};

const currencyTokenMap = new Map([
  ["STC", "0x1::STC::STC"],
  ["USDT", "ιθ¦ζδΎ"],
]);

export default {
  openNewWindow,
  currencyTokenMap,
};
