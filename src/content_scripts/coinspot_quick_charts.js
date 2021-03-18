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

function showTradeHistory(data) {
  const btn = createElement('button', 'pull-right btn btn-default btn-sm ml-1');
  btn.innerText = 'Trade Logs';
  document
    .querySelector('.page-header .hidden-xs')
    .insertBefore(btn, document.querySelector('.page-header .hidden-xs a'));

  const div = createElement('div', 'floatting-trade-list hide');
  const rows = [
    ['Date', 'Type', 'Amount', 'Rate ex. fee', 'Total'],
    ...data.orders.map((x) => Object.values(x)),
  ];
  const closeSpan = createElement('span', 'close');

  closeSpan.innerText = 'close';

  div.appendChild(closeSpan);

  const h2 = createElement('h2');
  h2.innerText = 'Trade history';
  div.appendChild(h2);
  rows.forEach((row) => {
    const rowEL = createElement('div', 'inner-row');
    row.forEach((col) => {
      const colEl = createElement('span');
      colEl.innerText = col;
      rowEL.appendChild(colEl);
    });
    div.appendChild(rowEL);
  });

  document.querySelector('body').appendChild(div);
  closeSpan.addEventListener('click', (e) => {
    toggleClass(div, 'hide');
  });
  btn.addEventListener('click', () => {
    toggleClass(div, 'hide');
  });
}

getTradeHistory(coin, (data) => {
  if (data.orders.length > 0) {
    showTradeHistory(data);
    addMiniChart(coin, data.orders[0].date, rightPanel);
    const sells = data.orders
      .filter((x) => x.type === 'Sell')
      .map((x) => x.amount);
    const balance = data.orders.reduce((amount, item) => {
      switch (item.type) {
        case 'Sell':
          return amount - +item.amount;
        case 'Buy':
        case 'Buy (Swap)':
          return amount + +item.amount;
      }
      return amount;
    }, 0);
    console.log('Current balance: ', balance);
    const currentInvest =
      balance > 0
        ? data.orders
            .filter((x) => !sells.includes(x.amount))
            .map((x) => +x.total.replace('AUD', ''))
            .reduce((a, b) => a + b, 0)
        : 0;
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
