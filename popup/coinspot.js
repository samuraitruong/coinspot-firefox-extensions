function runScriptOnContentPage(days) {
  browser.tabs
    .executeScript({
      file: '/content_scripts/coinspot_1.js',
    })
    .then(() => {
      browser.tabs.executeScript({ code: `insertChart(${days})` });
    })
    .catch((err) => alert(err));
}

document.querySelectorAll('button').forEach((el) => {
  const period = +el.getAttribute('data-period');
  el.addEventListener('click', () => {
    runScriptOnContentPage(period);
  });
});
