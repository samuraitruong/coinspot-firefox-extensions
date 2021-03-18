const mybrowser = chrome || browser;

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

function reloadIfSet() {
  const interval =
    +localStorage.getItem('refresh_' + document.location.href) || 0;
  if (interval > 0) {
    setInterval(() => {
      document.location.reload();
    }, interval * 1000);

    mybrowser.runtime.sendMessage({ type: 'setIcon' });
  } else {
    mybrowser.runtime.sendMessage({ type: 'removeIcon' });
  }
}

function updateHeaderWithCoinRank() {
  const coin = currentCoin();
  const coinList = JSON.parse(localStorage.getItem('coin_list') || '[]');
  const findCoin = coinList.find(
    (x) => x.coin.toLowerCase() === coin.toLocaleLowerCase(),
  );
  if (findCoin) {
    document.querySelector('.pophelp').innerHTML =
      document.querySelector('.pophelp').innerHTML + '  #' + findCoin.index;
  }
}

fetchDashboadData('D', showWalletValue);

setInterval(() => {
  fetchDashboadData('D', showWalletValue);
}, 30000);

updateHeaderWithCoinRank();

reloadIfSet();
