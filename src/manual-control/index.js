(function() {
  const lightBtn = document.getElementById('lightBtn');
  const darkBtn = document.getElementById('darkBtn');

  lightBtn.addEventListener('click', setLightTheme);
  darkBtn.addEventListener('click', setDarkTheme);

  function setLightTheme() {
    document.body.className = 'light-theme';
  }

  function setDarkTheme() {
    document.body.className = 'dark-theme';
  }
})();
