function createFloattingDiv(className) {
  const div = document.createElement('div');
  div.innerHTML = '<h3>Quick charts</h3>';
  div.setAttribute('class', 'info_floatting ' + className);
  document.querySelector('body').appendChild(div);

  return div;
}

function addMiniChart(coin, d, panel) {
  const chartDiv = document.createElement('div');
  chartDiv.innerHTML = `<img title="${d} days charts" alt="chart" src="https://coinspot-chart.herokuapp.com/chart?coin=${coin}&width=280&height=100&period=${d}&lineWidth=1" />`;
  panel.appendChild(chartDiv);
}
const coin = document.location.href.split('/').pop().replace('#', '');

const rightPanel = createFloattingDiv('right-panel');

const leftPanel = createFloattingDiv('left-panel');

addMiniChart(coin, 3, rightPanel);
addMiniChart(coin, 7, rightPanel);
addMiniChart(coin, 14, rightPanel);
addMiniChart(coin, 30, rightPanel);

addMiniChart(coin, 60, leftPanel);

addMiniChart(coin, 90, leftPanel);
addMiniChart(coin, 180, leftPanel);
addMiniChart(coin, 365, leftPanel);
