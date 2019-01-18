(function() {
  const buttonThemeLight = document.getElementById('themeLight');
  const buttonThemeDark = document.getElementById('themeDark');
  const buttonThemeAuto = document.getElementById('themeAuto');
  const buttonThemeAmbient = document.getElementById('optionAmbient');
  const buttonThemeLocation = document.getElementById('optionLocation');

  const themeSettings = document.querySelector('[data-theme-settings]');
  const themeAutoOptions = document.querySelector('[data-theme-auto-options]');
  const clock = document.getElementById('clock');

  themeSettings.addEventListener('click', showSettings, false);
  buttonThemeLight.addEventListener('click', setLightTheme, false);
  buttonThemeDark.addEventListener('click', setDarkTheme, false);
  buttonThemeAuto.addEventListener('click', showAutoOptions, false);
  buttonThemeAmbient.addEventListener('click', useAmbientLight, false);
  buttonThemeLocation.addEventListener('click', useLocation, false);

  function showSettings() {
    themeSettings.getAttribute('data-theme-settings') === 'hidden'
      ? themeSettings.setAttribute('data-theme-settings', 'show')
      : themeSettings.setAttribute('data-theme-settings', 'hidden');
  }

  function setLightTheme() {
    document.body.classList.add('theme--light');
    document.body.classList.remove('theme--dark');
  }

  function setDarkTheme() {
    document.body.classList.add('theme--dark');
    document.body.classList.remove('theme--light');
  }

  function showAutoOptions() {
    themeAutoOptions.setAttribute('data-theme-auto-options', 'show');
  }

  function useAmbientLight() {
    const sensor = new AmbientLightSensor();

    sensor.onreading = () => {
      const illuminance = sensor.illuminance;

      illuminanceElement.innerHTML = `Illuminance: ${illuminance}`;

      if (illuminance < 20) {
        document.body.className = 'theme--dark';
      } else if (illluminance > 30) {
        document.body.className = 'theme--light';
      }
    };

    sensor.onerror = ({ error }) => {
      console.log(error.name, error.message);
      alert(`${error.message}. Please use your location.`);
    };

    sensor.start();
  }

  function useLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      let currentTime = new Date();
      const { latitude, longitude } = position.coords;

      setInterval(() => {
        currentTime.setHours(currentTime.getHours() + 1);
        clock.innerHTML = `${currentTime.getHours()}:59`;
        let { sunrise, sunset } = SunCalc.getTimes(currentTime, latitude, longitude);
        updateCurrentTheme(currentTime, sunrise, sunset);
      }, 1000);
    });
  }

  function updateCurrentTheme(currentTime, sunrise, sunset) {
    (currentTime > sunrise && currentTime < sunset)
      ? setLightTheme()
      : setDarkTheme();
  }

  // Ambient light sensor
  if ('AmbientLightSensor' in window) {
    buttonThemeAmbient.parentElement.removeAttribute('hidden');
  }

  // Use current time
  if ('geolocation' in navigator) {
    buttonThemeLocation.parentElement.removeAttribute('hidden');
  }
})();
