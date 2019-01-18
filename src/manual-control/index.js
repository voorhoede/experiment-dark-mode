(() => {
  const lightBtn = document.getElementById('themeLight');
  const darkBtn = document.getElementById('themeDark');

  lightBtn.addEventListener('click', setLightTheme);
  darkBtn.addEventListener('click', setDarkTheme);

  function setLightTheme() {
    document.body.classList.add('theme--light');
    document.body.classList.remove('theme--dark');
  }

  function setDarkTheme() {
    document.body.classList.add('theme--dark');
    document.body.classList.remove('theme--light');
  }
})();
