const mywallet = JSON.parse(localStorage.getItem('mywallet') || '{}');

function addButton(coin, tr, type) {
  if (coin) {
    const btn = document.createElement('a');
    btn.setAttribute('class', 'btn btn-default btn-sm');
    btn.style.marginRight = '10px';
    btn.innerText = type.toUpperCase();
    btn.href = '/' + type.toLowerCase() + '/' + coin;
    btn.target = '__blank';
    btn.addEventListener('click', (e) => {
      e.cancelBubble = true;
    });

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
  const d = date.getDate();
  mywallet[coin][d] = mywallet[coin][d] || {};
  mywallet[coin][d][date.getHours()] = {
    value,
    rate,
  };
}

function withOpenOrder(coin, tr, orders) {
  if (!coin) return;
  const findCoin = orders.find((x) => x.coin === coin.toUpperCase());
  if (findCoin) {
    tr.setAttribute('class', tr.getAttribute('class') + ' has-order');
    const tds = tr.querySelectorAll('td');
    const link = document.createElement('a');
    link.setAttribute('class', 'order ' + findCoin.type);
    link.setAttribute('href', '/my/orders/open');
    link.setAttribute('target', '_blank');
    link.innerText =
      findCoin.type + ' at ' + findCoin.trigger + ' = ' + findCoin.total;
    link.addEventListener('click', (e) => {
      e.cancelBubble = true;
    });
    tds[tds.length == 6 ? 4 : 3].appendChild(link);
  } else {
  }
}

function addOrderFilter(count) {
  if (count === 0) return;
  const row = document.querySelector('.hidezero').parentElement;
  addClass(row, 'modified');
  const el = createElement('div', 'filter-wrapper');
  const chk = document.createElement('input', { type: 'checkbox' });
  chk.setAttribute('type', 'checkbox');
  el.innerText = 'Show only ' + count + ' orders';
  chk.addEventListener('change', (e) => {
    console.log('channed', e.target.checked);
    const panel = document.querySelector('body');
    const className = panel.getAttribute('class');
    if (e.target.checked) {
      panel.setAttribute('class', className + ' addon-filtered-order');
    } else {
      panel.setAttribute(
        'class',
        className.replace(' addon-filtered-order', ''),
      );
    }
  });
  el.appendChild(chk);
  row.appendChild(el);
}

eachRow((coin, tr) => addButton(coin, tr, 'sell'));
eachRow((coin, tr) => addButton(coin, tr, 'buy'));
eachRow(updateRank);

setTimeout(() => {
  eachRow((coin, tr) => updateData(coin, tr));
  localStorage.setItem('mywallet', JSON.stringify(mywallet));

  getOpenOrders(({ openSellOrders, openBuyOrders }) => {
    const orders = [...openSellOrders, ...openBuyOrders];
    addOrderFilter(orders.length);
    eachRow((coin, tr) => withOpenOrder(coin, tr, orders));
  });
}, 1000);
