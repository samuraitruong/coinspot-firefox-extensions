const mywallet = JSON.parse(localStorage.getItem('mywallet') || '{}');
function eachRow(callback) {
  document.querySelectorAll('table tbody tr').forEach((tr) => {
    const coin = tr.getAttribute('data-coin');
    callback(coin, tr);
  });
}

function addButton(coin, tr, type) {
  if (coin) {
    const btn = document.createElement('a');
    btn.setAttribute('class', 'btn btn-default btn-sm');
    btn.style.marginRight = '10px';
    btn.innerText = type.toUpperCase();
    btn.setAttribute('href', '/' + type.toLowerCase() + '/' + coin);
    const buttons = tr.querySelectorAll('.btn');
    if (buttons[0]) {
      buttons[0].innerText = 'WALLET';
      buttons[0].setAttribute('style', '');
      buttons[0].parentElement.appendChild(btn);
    }
  }
}

function updateData(coin, tr) {
  const tds = tr.querySelectorAll('td');
  if (!coin || tds.length === 4) return;
  const value = +tds[4].getAttribute('data-value');
  const rate = tds[3].getAttribute('data-value');
  const balance = +tr.getAttribute('data-amount');
  const date = new Date();
  if (mywallet[coin] && balance === mywallet[coin].balance) {
    const last = mywallet[coin].value;
    const changed = +(value - last).toFixed(1);
    const color = changed > 0 ? 'green' : 'red';
    if (changed !== 0) {
      console.log(coin, changed);
      const span = document.createElement('span');
      span.style = `color:${color}; float:right`;
      span.innerHTML = changed > 0 ? '+' + changed : changed;
      span.addEventListener('click', (e) => {
        e.cancelBubble = true;
        //alert('memememme');
      });
      tds[4].appendChild(span);
    }
  }
  mywallet[coin] = {
    balance,
    value,
    rate,
  };
  const d = date.getDay();
  mywallet[coin][d] = mywallet[coin][d] || {};
  mywallet[coin][d][date.getHours()] = {
    value,
    rate,
  };
}

function getOpenOrders(callback) {
  fetch('https://www.coinspot.com.au/my/orders/open')
    .then((x) => x.text())
    .then((html) => {
      const div = document.createElement('div');
      div.id = 'virtualbacon';
      // div.style = 'display: none';
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
    });
}

function withOpenOrder(coin, tr, orders) {
  if (!coin) return;
  const findCoin = orders.find((x) => x.coin === coin.toUpperCase());
  if (findCoin) {
    const tds = tr.querySelectorAll('td');
    const link = document.createElement('a');
    link.setAttribute('class', 'order ' + findCoin.type);
    link.setAttribute('href', '/my/orders/open');
    link.setAttribute('target', '_blank');
    link.innerText = findCoin.type + ':  ' + findCoin.total;
    link.addEventListener('click', (e) => {
      e.cancelBubble = true;
    });
    tds[tds.length == 6 ? 4 : 3].appendChild(link);
  }
  else {
    
  }
}

eachRow((coin, tr) => addButton(coin, tr, 'sell'));
eachRow((coin, tr) => addButton(coin, tr, 'buy'));
setTimeout(() => {
  eachRow((coin, tr) => updateData(coin, tr));
  localStorage.setItem('mywallet', JSON.stringify(mywallet));

  getOpenOrders((orders) => {
    eachRow((coin, tr) => withOpenOrder(coin, tr, orders));
  });
}, 1000);
