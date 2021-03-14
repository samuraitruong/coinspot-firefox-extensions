function runScriptOnContentPage(days) {
  if (chrome) {
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
document.querySelector('#btnRefreshButton').addEventListener('click', () => {
  const value = +document.querySelector('#refreshInterval').value;

  if (chrome) {
    chrome.tabs.executeScript(
      {
        code: `localStorage.setItem("refresh_" +document.location.href, ${value})`,
      },
      (err) => {
        console.log(err);
      },
    );
  }
});

document.querySelectorAll('button').forEach((el) => {
  let period = el.getAttribute('data-period');
  if (period) {
    el.addEventListener('click', () => {
      if (period === 'custom') {
        period = document.querySelector('#custom').value;
      }

      runScriptOnContentPage(+period);
    });
  }
});

window.onload = () => {
  if (chrome) {
    chrome.tabs.executeScript(
      {
        code: `localStorage.getItem('refresh_' + document.location.href)`,
      },
      (result, err) => {
        console.log(result, err);
        document.querySelector('#refreshInterval').value = result[0] || '0';
        if (result[0]) {
          chrome.browserAction.setIcon({ path: icon });
        }
      },
    );
  }
};
