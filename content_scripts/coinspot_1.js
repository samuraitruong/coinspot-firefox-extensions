function insertChart(d, header) {
  let index = 0;
  document.querySelectorAll('table tr').forEach((el) => {
    var td = document.createElement('td');
    let label = header || 'Last ' + d + ' Days';
    const coin = el.getAttribute('data-coin');
    if (coin) {
      const td = document.createElement('td');
      td.innerHTML = `<img alt="chart" src="https://coinspot-chart.herokuapp.com/chart?coin=${coin}&width=100&height=50&period=${d}&lineWidth=0.7" />`;
      el.appendChild(td);
    } else {
      const th = document.createElement('th');
      th.innerHTML = label;
      el.appendChild(th);
    }

    index++;
  });
}

// insertChart(3);
// insertChart(7);
