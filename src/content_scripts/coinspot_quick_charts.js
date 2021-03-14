function createFloattingDiv(className) {
  const div = createElement('div', 'info_floatting ' + className);
  const h3 = document.createElement('h3');
  h3.innerText = 'Quick charts';
  div.appendChild(h3);
  document.querySelector('body').appendChild(div);
  h3.addEventListener('click', () => {
    toggleClass(div, 'quickcharts-hide');
  });
  return div;
}

function addMiniChart(coin, d, panel) {
  const chartDiv = document.createElement('div');
  chartDiv.innerHTML = `<img title="${d} days charts" alt="chart" src="https://coinspot-chart.herokuapp.com/chart?coin=${coin}&width=280&height=100&period=${d}&lineWidth=1" />`;
  panel.appendChild(chartDiv);
}

const coin = currentCoin();

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
    const sells = data.orders
      .filter((x) => x.type === 'Sell')
      .map((x) => x.amount);
    const currentInvest = data.orders
      .filter((x) => !sells.includes(x.amount))
      .map((x) => +x.total.replace('AUD', ''))
      .reduce((a, b) => a + b, 0);
    const insertDiv = (hostClass) => {
      const infoDiv = document.createElement('div');
      infoDiv.style.color = 'green';
      infoDiv.innerText = 'Invested Amount: ' + formatCurrency(currentInvest);

      document
        .querySelector(hostClass + ' h3')
        .parentElement.appendChild(infoDiv);
    };
    insertDiv('.howmuchcoin');
    insertDiv('.howmuchaud');
  }
});
addWalletMenu(coin);
addMiniChart(coin, 3, rightPanel);
addMiniChart(coin, 7, rightPanel);
addMiniChart(coin, 14, rightPanel);
addMiniChart(coin, 30, rightPanel);

addMiniChart(coin, 45, rightPanel);

addMiniChart(coin, 60, leftPanel);

addMiniChart(coin, 90, leftPanel);
addMiniChart(coin, 120, leftPanel);
addMiniChart(coin, 180, leftPanel);
addMiniChart(coin, 365, leftPanel);
