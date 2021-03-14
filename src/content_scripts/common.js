function formatCurrency(amount) {
  return (
    amount.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }) + ' AUD'
  );
}
function addClass(el, className) {
  el.setAttribute('class', el.getAttribute('class') + ' ' + className);
}
function toggleClass(el, className) {
  const currentClassName = el.getAttribute('class');
  if (currentClassName.includes(className)) {
    el.setAttribute('class', currentClassName.replace(className, ''));
  } else {
    el.setAttribute('class', currentClassName + ' ' + className);
  }
}
function createElement(tagName, className, options) {
  const el = document.createElement(tagName);
  addClass(el, className);

  return el;
}

function eachRow(callback) {
  document.querySelectorAll('table tbody tr').forEach((tr) => {
    const coin = tr.getAttribute('data-coin');
    callback(coin, tr);
  });
}

// fetch dashboard data
function fetchDashboadData(typeframe, callback) {
  fetch(
    'https://www.coinspot.com.au/my/charts/portfolio?timeframe=' + typeframe,
  )
    .then((res) => res.json())
    .then(callback);
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
      if (orderHistory) {
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
      }
    });
}

function getSellRate(coin, amount, callback) {
  fetch('https://www.coinspot.com.au/sell/' + coin.toLowerCase() + '/rate/aud')
    .then((x) => x.json())
    .then(callback);
}

function getOpenOrders(callback) {
  fetch('https://www.coinspot.com.au/my/orders/open')
    .then((x) => x.text())
    .then((html) => {
      const div = document.createElement('div');
      div.id = 'virtualbacon';
      div.innerHTML = html;
      document.querySelector('body').appendChild(div);

      const table = document.querySelectorAll('#virtualbacon table');
      const tr = table[1].querySelectorAll('tbody tr');
      const data = [];
      tr.forEach((el) => {
        const row = [];
        el.querySelectorAll('td').forEach((td) =>
          row.push(td.innerText.trim()),
        );
        const [date, coin, type, amount, trigger, total] = row;
        data.push({ date, coin, type, amount, trigger, total });
      });
      callback(data);
      div.remove();
    });
}

function getSaleHistory(coin, minutes, callback) {
  const now = new Date().getTime();

  const start = now - minutes * 60 * 1000;

  fetch(
    `https://www.coinspot.com.au/charts/sellhistory_basic?symbol=${coin.toUpperCase()}&from=${start}&to=${now}`,
  )
    .then((x) => x.json())
    .then((json) => {
      callback(json);
    });
}

function currentCoin() {
  const coin = document.location.href.split('/').pop().replace('#', '');
  return coin;
}

function updateRank(coin, tr) {
  const coinList = JSON.parse(localStorage.getItem('coin_list') || '[]');
  const findCoin = coinList.find(
    (x) => x.coin.toLowerCase() === coin.toLocaleLowerCase(),
  );
  if (findCoin) {
    const span = document.createElement('a');
    addClass(span, 'pull-right rank-text');
    span.innerText = tr.getAttribute('data-coindisplay') + '#' + findCoin.index;
    span.addEventListener('click', (e) => {
      e.cancelBubble = true;
    });
    span.target = '__blank';
    span.href =
      'https://coinmarketcap.com/currencies/' +
      tr
        .getAttribute('data-displayname')
        .toLocaleLowerCase()
        .replace(/\s/gi, '-');
    tr.querySelector('td').appendChild(span);
  }
}
