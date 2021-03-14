function insertChart(d, header) {
  document.querySelectorAll('table tr').forEach((el, index) => {
    var td = document.createElement('td');
    let label = header || 'Last ' + d + ' Days';

    if (index > 0) {
      label = `<img alt="chart" src="https://coinspot-chart.herokuapp.com/chart?coin=${el.getAttribute(
        'data-coin',
      )}&width=100&height=50&period=${d}&lineWidth=0.7" />`;
    }
    td.innerHTML = label;
    el.appendChild(td);
  });
}

function updateCoinsList() {
  const list = [];
  let index = 1;
  eachRow((coin, tr) => {
    const td = tr.querySelectorAll('td');
    const item = {
      coin,
      cap: +td[3].getAttribute('data-value'),
      capDisplay: td[3].innerText,
      vol24: +td[4].getAttribute('data-value'),
      vol24Display: td[4].innerText,
      index,
    };
    index++;
    list.push(item);
  });
  localStorage.setItem('coin_list', JSON.stringify(list));
}

updateCoinsList();
// insertChart(3);
// insertChart(7);
eachRow(updateRank);
