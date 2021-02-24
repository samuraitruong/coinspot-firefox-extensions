const floating = document.createElement('div');
floating.innerHTML = '<h3>Quick charts</h3>';
floating.setAttribute('class', 'info_floatting');
floating.style.position = 'fixed';
floating.style.width = '300px';
floating.style.top = '150px';
floating.style.paddingTop = '25px';
floating.style.right = '10px';

function addMiniChart(coin, d) {
  const chartDiv = document.createElement('div');
  chartDiv.innerHTML = `<img title="${d} days charts" alt="chart" src="https://coinspot-chart.herokuapp.com/chart?coin=${coin}&width=280&height=100&period=${d}&lineWidth=0.9" />`;
  chartDiv.style.borderBottom = '#ddd dotted 1px ';
  floating.appendChild(chartDiv);
}
const coin = document.location.href.split('/').pop().replace('#', '');

document.querySelector('body').appendChild(floating);
addMiniChart(coin, 3);
addMiniChart(coin, 7);
addMiniChart(coin, 14);
addMiniChart(coin, 30);
