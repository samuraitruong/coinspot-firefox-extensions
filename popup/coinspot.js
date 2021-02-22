function runScriptOnContentPage(days) {
  if (chrome.tags) {
    chrome.tabs.executeScript(
      {
        file: '/content_scripts/coinspot_1.js',
      },
      (err) => {
        chrome.tabs.executeScript({ code: `insertChart(${days})` });
      },
    );
  } else {
    browser.tabs
      .executeScript({
        file: '/content_scripts/coinspot_1.js',
      })
      .then(() => {
        browser.tabs.executeScript({ code: `insertChart(${days})` });
      })
      .catch((err) => alert(err));
  }
}

document.querySelectorAll('button').forEach((el) => {
  let period = el.getAttribute('data-period');
  el.addEventListener('click', () => {
    if (period === 'custom') {
      period = document.querySelector('#custom').value;
    }

    runScriptOnContentPage(+period);
  });
});
