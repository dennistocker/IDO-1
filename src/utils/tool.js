const openNewWindow = (url) => {
  window.open(url, "_blank");
};

const currencyTokenMap = new Map([
  ["STC", "0x1::STC::STC"],
  ["USDT", "需要提供"],
]);

export default {
  openNewWindow,
  currencyTokenMap,
};
