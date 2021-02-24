function saveOptions(e) {
  e.preventDefault();
  const settings = {};
  document.querySelectorAll('input').forEach((el) => {
    settings[el.getAttribute('id')] = el.checked || el.value;
  });
  browser.storage.sync.set({
    settings: JSON.stringify(settings),
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
    Object.keys(value).map((key) => {
      const el = document.querySelector('#' + key);
      el.value = value[key];

      if (el.getAttribute('type') === 'checkbox') {
        el.checked = value[key];
      }
    });
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get('settings');
  getting.then(setCurrentChoice, onError);
}

document.querySelector('form').addEventListener('submit', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);
