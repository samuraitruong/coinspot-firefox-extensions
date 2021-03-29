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

function getTradeHistory(coin, callback) {
  fetch('https://www.coinspot.com.au/my/wallet/' + coin + '/tradehistory')
    .then((x) => x.text())
    .then((html) => {
      var div = document.createElement('div');
      div.setAttribute('class', 'wallet-page');
      div.innerHTML = html;
      document.querySelector('body').appendChild(div);
      const orderHistory = document.querySelectorAll('table')[0];
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

function getBuyRate(coin, amount, callback) {
  fetch('https://www.coinspot.com.au/buy/' + coin.toUpperCase() + '/rate')
    .then((x) => x.json())
    .then(callback);
}

function getOpenOrders(callback) {
  if (window.getOpenOrdersData) {
    callback(window.getOpenOrdersData);
    return;
  }
  fetch('https://www.coinspot.com.au/my/orders/open')
    .then((x) => x.text())
    .then((html) => {
      const div = document.createElement('div');
      div.id = 'virtualbacon';
      div.innerHTML = html;
      document.querySelector('body').appendChild(div);

      const tables = document.querySelectorAll('#virtualbacon table');
      const allTables = [];
      tables.forEach((tb) => {
        const tr = tb.querySelectorAll('tbody tr');
        const data = [];
        tr.forEach((el) => {
          const row = [];
          el.querySelectorAll('td').forEach((td) =>
            row.push(td.innerText.trim()),
          );
          // get form
          const form = {
            data: {},
            action: el.querySelector('form')?.getAttribute('action'),
          };
          el.querySelectorAll('form input').forEach((input) => {
            form.data[input.name] = input.value;
          });
          const [date, coin, type, amount, trigger, total] = row;
          data.push({ date, coin, type, amount, trigger, total, form });
        });
        allTables.push(data);
      });
      const [marketOrders, openSellOrders, openBuyOrders] = allTables;
      window.getOpenOrdersData = {
        marketOrders,
        openSellOrders,
        openBuyOrders,
      };
      callback(window.getOpenOrdersData);
      div.remove();
    });
}

function getLastPrice(coin, callback) {
  const url =
    'https://www.coinspot.com.au/charts/latestprice?symbol=' +
    coin.toUpperCase();
  fetch(url)
    .then((res) => res.json())
    .then(callback);
}

function getBuyHistory(coin, minutes, callback) {
  const now = new Date().getTime();

  const start = now - minutes * 60 * 1000;

  fetch(
    `https://www.coinspot.com.au/charts/history_basic?symbol=${coin.toUpperCase()}&from=${start}&to=${now}`,
  )
    .then((x) => x.json())
    .then((json) => {
      callback(json);
    });
}

function getBuyData(coin, minutes, callback) {
  getBuyHistory(coin, minutes, (data) => {
    const price = data.map((x) => x[1]);

    callback({
      min: Math.min(...price),
      max: Math.max(...price),
    });
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

function cancelOrder(item, callback) {
  return (e) => {
    const { action, data } = item.form;

    fetch('https://www.coinspot.com.au' + action, {
      headers: {
        'accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'pragma': 'no-cache',
        'sec-ch-ua':
          '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
      },
      referrer: 'https://www.coinspot.com.au/my/orders/open',
      referrerPolicy: 'same-origin',
      body: '_csrf=&redirect=%2Fmy%2Forders%2Fopen%23s&id=' + data.id,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    })
      .then((res) => res.text())
      .then((html) => {
        if (html.includes('cancel request sent successfully.')) {
          console.log('cancel request sent successfully.');
          return callback(true);
        }
        callback();
      });
    return false;
  };
  //
}
