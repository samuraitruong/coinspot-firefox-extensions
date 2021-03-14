const logs = {};

function addHistoryItem(days, amount) {
  if (!logs[days]) {
    const wrapper = document.querySelector('.howmuchcoin .form-group');

    const el = createElement('div', 'history-prices');
    wrapper.insertBefore(el, wrapper.querySelector('.clearfix'));
    getSaleHistory(currentCoin(), days * 60 * 24, (data) => {
      const first = data[0];
      const last = data.pop();
      const item1 = createElement('span');
      item1.innerText = `${days} days ago `;

      const item2 = createElement('span');
      item2.innerText = '$' + first[1].toString().padEnd(12, '0');

      const item3 = createElement('span');
      item3.innerText = formatNumber(amount * first[1], false);

      const item4 = createElement('span');
      item4.innerText = (
        (((last[1] - first[1]) / first[1]) * 100).toFixed(1) + '%'
      ).padStart(5, ' ');
      if (last[1] < first[1]) {
        addClass(el, 'negative');
      }
      el.appendChild(item1);
      el.appendChild(item2);
      el.appendChild(item3);
      el.appendChild(item4);

      logs[days] = [el, data];
    });
  }
}
function onAmountChange(event) {
  const amount = document.querySelector('.sellinput').value;
  for (let i = 1; i <= 14; i++) addHistoryItem(i, amount);
}

document.querySelector('.sellinput').addEventListener('change', onAmountChange);
document.querySelector('.sellmax').addEventListener('click', onAmountChange);

document.querySelector('.sellmax').click();
setInterval(() => document.querySelector('.sellmax').click(), 10000);
