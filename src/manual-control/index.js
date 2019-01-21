(() => {
  const lightButton = document.getElementById('light-theme');
  const darkButton = document.getElementById('dark-theme');

  lightButton.addEventListener('click', setLightTheme);
  darkButton.addEventListener('click', setDarkTheme);

  function setLightTheme() {
    document.body.classList.add('theme--light');
    document.body.classList.remove('theme--dark');
  }

  function setDarkTheme() {
    document.body.classList.add('theme--dark');
    document.body.classList.remove('theme--light');
  }
})();
