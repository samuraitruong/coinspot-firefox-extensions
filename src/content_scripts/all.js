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
  fetch(
    'https://www.coinspot.com.au/my/charts/portfolio?timeframe=' + typeframe,
  )
    .then((res) => res.json())
    .then(callback);
}
let wrapper = null;

function showWalletValue(data) {
  if (!wrapper) {
    wrapper = document.createElement('div');
    document
      .querySelector('.userheader .headervalue')
      .parentElement.appendChild(wrapper);
  }
  const walleValue = data.coinsValue;

  const lastValue = localStorage.getItem('wallet_value') || 0;
  const change = toNumber(walleValue) - toNumber(lastValue);
  localStorage.setItem('wallet_value', walleValue);

  const style = change < 0 ? 'negative' : 'positive';

  const changeHtml =
    change != 0
      ? `<span class='value-change ${style}'>${formatNumber(change)}</span>`
      : '';
  wrapper.innerHTML =
    '<span id="wallet-value"> Wallet value: ' +
    formatNumber(walleValue, false) +
    '</span>' +
    changeHtml;
}

fetchDashboadData('D', showWalletValue);

setInterval(() => {
  fetchDashboadData('D', showWalletValue);
}, 30000);

// chrome.runtime.onMessage.addListener(function (request, sender) {
//   console.log('message from background', request.message);
// });
