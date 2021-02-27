document.querySelectorAll('table tbody tr').forEach((tr) => {
  const coin = tr.getAttribute('data-coin');
  if (coin) {
    const addButton = (type) => {
      const btn = document.createElement('a');
      btn.setAttribute('class', 'btn btn-default btn-sm');
      btn.style.marginRight = '10px';
      btn.innerText = type.toUpperCase() + ' ' + coin.toUpperCase();
      btn.setAttribute('href', '/' + type.toLowerCase() + '/' + coin);
      const button = tr.querySelector('.btn');
      if (button) {
        button.parentElement.appendChild(btn);
      }
    };
    addButton('buy');
    addButton('sell');
  }
});
