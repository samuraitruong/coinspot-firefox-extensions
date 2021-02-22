document.querySelector('.sellmax').click();
setInterval(() => document.querySelector('.sellmax').click(), 10000);

browser.tabs.insertCSS({ file: '/content_css/sell.css' }).then(() => {});

const iframe = document.createElement('iframe');
iframe.setAttribute('src', 'https://www.coinspot.com.au/my/wallet/game');
iframe.onload = () => {
  const floating = document.createElement('div');
  floating.setAttribute('class', 'info_floatting');
  document.querySelector('body').appendChild(floating);
};
document.querySelector('body').appendChild(iframe);
