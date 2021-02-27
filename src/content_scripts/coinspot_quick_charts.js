function createFloattingDiv(className) {
  const div = document.createElement('div');
  div.innerHTML = '<h3>Quick charts</h3>';
  div.setAttribute('class', 'info_floatting ' + className);
  document.querySelector('body').appendChild(div);

  return div;
}

function addMiniChart(coin, d, panel) {
  const chartDiv = document.createElement('div');
  chartDiv.innerHTML = `<img title="${d} days charts" alt="chart" src="https://coinspot-chart.herokuapp.com/chart?coin=${coin}&width=280&height=100&period=${d}&lineWidth=1" />`;
  panel.appendChild(chartDiv);
}

function getWaletPage(coin, callback) {
  fetch('https://www.coinspot.com.au/my/wallet/' + coin)
    .then((x) => x.text())
    .then((html) => {
      var div = document.createElement('div');
      div.setAttribute('class', 'wallet-page');
      div.innerHTML = html;
      document.querySelector('body').appendChild(div);
      const orderHistory = document.querySelectorAll('table')[2];
      const orders = [];
      orderHistory.querySelectorAll('tr').forEach((el) => {
        const values = [];
        el.querySelectorAll('td').forEach((e) =>
          values.push(e.innerText.trim()),
        );
        if (values.length > 0) {
          const [date, type, amount, rate, total] = values;
          orders.push({ date, type, amount, rate, total });
        }
      });
      callback({ orders });
    });
}
const coin = document.location.href.split('/').pop().replace('#', '');

const rightPanel = createFloattingDiv('right-panel');

const leftPanel = createFloattingDiv('left-panel');
function addWalletMenu(coin) {
  const div = document.createElement('div');
  div.setAttribute('class', 'col-xs-2 menuheight');
  div.innerHTML = `<a href="/my/wallet/${coin}" class="btn fs-large">Wallet ${coin.toUpperCase()}</a>`;
  document.querySelector('.bssheader .row').appendChild(div);
}
getWaletPage(coin, (data) => {
  if (data.orders.length > 0) {
    addMiniChart(coin, data.orders[0].date, rightPanel);
  }
});
addWalletMenu(coin);
addMiniChart(coin, 3, rightPanel);
addMiniChart(coin, 7, rightPanel);
addMiniChart(coin, 14, rightPanel);
addMiniChart(coin, 30, rightPanel);

addMiniChart(coin, 60, leftPanel);

addMiniChart(coin, 90, leftPanel);
addMiniChart(coin, 180, leftPanel);
addMiniChart(coin, 365, leftPanel);
