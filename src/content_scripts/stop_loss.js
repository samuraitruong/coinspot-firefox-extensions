function onSelect(e) {
  if (document.querySelector('a.addon-selected')) {
    document.querySelector('a.addon-selected').setAttribute('class', '');
  }
  e.target.setAttribute('class', 'addon-selected');
  const price = +document
    .querySelector('.price-title span')
    .innerText.substring(1);
  const coin = currentCoin();

  getSellRate(coin, price, (data) => {
    const percent = +e.target.getAttribute('data-value');
    const desirePrice = (+data.rate * percent) / 100;
    document.querySelector('.sellprice').value = desirePrice.toFixed(8);
    document.querySelector('.price-title span').innerText =
      '$' + data.displayrate;
    document.querySelector('.sellmax').click();
  });

  return false;
}

function addSelectors(page) {
  const container = document.querySelector('.form-group');

  const el = document.createElement('div');
  el.setAttribute('class', 'selector-list');

  const setup = {
    stoploss: [60, 65, 70, 75, 80, 85, 90, 92, 94, 96, 98, 99],
    takeprofit: [20, 30, 50, 75, 100, 125, 150, 200, 300, 500],
  };
  setup[page].forEach((p) => {
    const link = document.createElement('a');
    link.innerText = p + '%';
    el.appendChild(link);
    link.setAttribute('data-value', page === 'takeprofit' ? 100 + p : p);
    link.addEventListener('click', onSelect);
  });
  container.appendChild(el);
}

const arr = document.location.href.split('/');

addSelectors(arr[3]);
