function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    data: JSON.stringify({
      key: document.querySelector('#key').value,
      secret: document.querySelector('#secret').value,
    }),
  });
  const span = document.createElement('span');
  span.innerText = 'Setting saved.';
  document.querySelector('body').appendChild(span);
  setTimeout(() => {
    span.remove();
  }, 5000);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    const value = JSON.parse(result.data);
    document.querySelector('#key').value = value.key;
    document.querySelector('#secret').value = value.secret;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get('data');
  getting.then(setCurrentChoice, onError);
}

document.querySelector('form').addEventListener('submit', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);
