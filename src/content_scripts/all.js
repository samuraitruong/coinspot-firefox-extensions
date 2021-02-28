function toNumber(x) {
  if (!isNaN(x)) return x;
  if (x === 0) return 0;
  return +x.replace('$', '').replace(',', '').replace('AUD', '');
}
function formatNumber(numValue, prefix = true) {
  return (
    (prefix && numValue > 0 ? '+ ' : '') +
    numValue.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }) +
    ' AUD'
  );
}
function fetchDashboadData(typeframe, callback) {
  fetch('https://www.coinspot.com.au/my/dbgraphdata?timeframe=' + typeframe)
    .then((res) => res.json())
    .then(callback);
}
function showWalletValue(data) {
  const walleValue = +data.wallet;

  const lastValue = localStorage.getItem('wallet_value') || 0;
  const change = toNumber(walleValue) - toNumber(lastValue);
  localStorage.setItem('wallet_value', walleValue);

  const html = document.querySelector('.userheader .headervalue').parentElement
    .innerHTML;
  const style = change < 0 ? 'negative' : 'positive';

  const changeHtml =
    change != 0
      ? `<span class='value-change ${style}'>${formatNumber(change)}</span>`
      : '';
  document.querySelector('.userheader .headervalue').parentElement.innerHTML =
    html +
    '<br/> <span> Wallet value: ' +
    formatNumber(walleValue, false) +
    '</span>' +
    changeHtml;
}

fetchDashboadData('D', showWalletValue);
