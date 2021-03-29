function onSelect(e) {
  if (document.querySelector('a.addon-selected')) {
    document.querySelector('a.addon-selected').setAttribute('class', '');
  }
  e.target.setAttribute('class', 'addon-selected');
  const price = +document
    .querySelector('.price-title span')
    .innerText.substring(1);
  const coin = currentCoin();
  const selectValue = e.target.getAttribute('data-value');
  if (selectValue.match(/d/)) {
    const minutes = +selectValue.replace('d', '') * 24 * 60;
    getBuyData(coin, minutes, ({ min }) => {
      document.querySelector('.buyprice').value = min.toFixed(8);
    });
  } else {
    getBuyRate(coin, price, (data) => {
      const percent = +selectValue;
      const desirePrice = (+data.marketrate * (100 + percent)) / 100;
      document.querySelector('.buyprice').value = desirePrice.toFixed(8);
      document.querySelector('.price-title span').innerText =
        data.marketDisplayRateFormatted;
    });
  }
  return false;
}

function addSelectors(page) {
  const container = document.querySelector('.form-group');

  const el = document.createElement('div');
  el.setAttribute('class', 'selector-list');

  const setup = {
    buylimit: [
      -50,
      -45,
      -40,
      -35,
      -30,
      -25,
      -20,
      -15,
      -15,
      -10,
      -5,
      -1,
      '1d',
      '2d',
      '3d',
      '4d',
      '5d',
      '6d',
      '7d',
      '8d',
      '9d',
      '10d',
      '14d',
    ],
    takeprofit: [20, 30, 50, 75, 100, 125, 150, 200, 300, 500],
  };
  setup[page].forEach((p) => {
    const link = document.createElement('a');
    link.innerText = p.toString().includes('d') ? p : `${p}%`;
    el.appendChild(link);
    link.setAttribute('data-value', page === 'takeprofit' ? 100 + p : p);
    link.addEventListener('click', onSelect);
  });
  container.appendChild(el);
}

const arr = document.location.href.split('/');

addSelectors(arr[3]);
