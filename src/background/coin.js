if (chrome) {
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log('Received %o from %o, frame', msg, sender.tab, sender.frameId);
    switch (msg.type) {
      case 'setIcon':
        chrome.browserAction.setIcon({ path: '/icons/48x48.png' });
        break;
    }
    sendResponse('OK');
  });
  chrome.runtime.onInstalled.addListener(function () {
    //some other code here
  });
}
