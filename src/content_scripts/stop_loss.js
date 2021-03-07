function getSellRate(coin, amount, callback) {
  fetch('https://www.coinspot.com.au/sell/' + coin.toLowerCase() + '/rate/aud')
    .then((x) => x.json())
    .then(callback);
}
function onSelect(e) {
  if (document.querySelector('a.addon-selected')) {
    document.querySelector('a.addon-selected').setAttribute('class', '');
  }
  e.target.setAttribute('class', 'addon-selected');
  const price = +document
    .querySelector('.price-title span')
    .innerText.substring(1);
  const coin = document.location.href.split('/').pop().replace('#', '');

  getSellRate(coin, price, (data) => {
    const percent = +e.target.getAttribute('data-value');
    const desirePrice = (+data.rate * percent) / 100;
    document.querySelector('.sellprice').value = desirePrice.toFixed(8);
    document.querySelector('.price-title span').innerText =
      '$' + data.displayrate;
  });

  return false;
}

function addSelectors() {
  const container = document.querySelector('.form-group');

  const el = document.createElement('div');
  el.setAttribute('class', 'selector-list');

  const setup = [80, 85, 90, 92, 94, 96, 98, 99];
  setup.forEach((p) => {
    const link = document.createElement('a');
    link.innerText = p + '%';
    el.appendChild(link);
    link.setAttribute('data-value', p);
    link.addEventListener('click', onSelect);
  });
  container.appendChild(el);
}

addSelectors();
