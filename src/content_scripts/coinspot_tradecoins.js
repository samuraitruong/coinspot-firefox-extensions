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

// insertChart(3);
// insertChart(7);
