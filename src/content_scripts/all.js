function toNumber(x) {
  if (x === 0) return 0;
  return +x.replace('$', '').replace(',', '').replace('AUD', '');
}
function formatNumber(numValue) {
  return (
    (numValue > 0 ? '+ ' : '') +
    numValue.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }) +
    ' AUD'
  );
}
function getWallelValue(callback) {
  fetch('https://www.coinspot.com.au/my/wallets')
    .then((x) => x.text())
    .then((html) => {
      var div = document.createElement('div');
      div.setAttribute('class', 'virtual-div');
      div.innerHTML = html;
      document.querySelector('body').appendChild(div);
      const walleValue = document.querySelector('.wallets .panel-subheading b')
        .innerText;
      const lastValue = localStorage.getItem('wallet_value') || 0;
      const change = toNumber(walleValue) - toNumber(lastValue);
      localStorage.setItem('wallet_value', walleValue);

      callback(walleValue, change);
    });
}

getWallelValue((value, change) => {
  const html = document.querySelector('.userheader .headervalue').parentElement
    .innerHTML;
  const style = change < 0 ? 'negative' : 'positive';

  const changeHtml =
    change != 0
      ? `<span class='value-change ${style}'>${formatNumber(change)}</span>`
      : '';
  document.querySelector('.userheader .headervalue').parentElement.innerHTML =
    html + '<br/> <span> Wallet value: ' + value + '</span>' + changeHtml;
});