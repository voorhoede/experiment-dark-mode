(function() {
  // Element variables
  const buttonThemeLight = document.getElementById('themeLight');
  const buttonThemeDark = document.getElementById('themeDark');
  const buttonThemeAuto = document.getElementById('themeAuto');
  const buttonThemeAmbient = document.getElementById('optionAmbient');
  const buttonThemeLocation = document.getElementById('optionLocation');
  const buttonThemeSystem = document.getElementById('optionSystem');
  const themeSettings = document.querySelector('[data-theme-settings]');
  const themeAutoOptions = document.querySelector('[data-theme-auto-options]');
  const speedUpButton = document.querySelector('[data-speed-up-timer]');
  const clock = document.getElementById('clock');

  // Events
  buttonThemeLight.addEventListener('click', useLightTheme, false);
  buttonThemeDark.addEventListener('click', useDarkTheme, false);
  buttonThemeAuto.addEventListener('click', showAutoOptions, false);
  buttonThemeAmbient.addEventListener('click', useAmbientLight, false);
  buttonThemeLocation.addEventListener('click', useLocation, false);
  buttonThemeSystem.addEventListener('click', useSystem, false);
  speedUpButton.addEventListener('click', adjustTimer, false);
  themeSettings.addEventListener('click', showSettings, false);

  let timer = null;
  let currentTime = new Date();

  /**
   * setLightTheme
   *
   * Sets colors to a light theme.
   */
  function setLightTheme() {
    document.body.classList.add('theme--light');
    document.body.classList.remove('theme--dark');
  }

  /**
   * setDarkTheme
   *
   * Sets colors to a dark theme.
   */
  function setDarkTheme() {
    document.body.classList.add('theme--dark');
    document.body.classList.remove('theme--light');
  }

  /**
   * showSettings
   *
   * Toggle the demo theme settings menu.
   */
  function showSettings() {
    themeSettings.getAttribute('data-theme-settings') === 'hidden'
      ? themeSettings.setAttribute('data-theme-settings', 'show')
      : themeSettings.setAttribute('data-theme-settings', 'hidden');
  }

  /**
   * showAutoOptions
   *
   * Show extra options when 'Auto' is selected.
   */
  function showAutoOptions() {
    themeAutoOptions.setAttribute('data-theme-auto-options', 'show');
  }

  /**
   * useLightTheme
   *
   * User selected light theme manually.
   * - 'Auto' options are hidden
   * - Timer and clock are reset
   * - Run setLightTheme()
   */
  function useLightTheme() {
    themeAutoOptions.setAttribute('data-theme-auto-options', 'hide');
    clearInterval(timer);
    clock.innerHTML = '';
    setLightTheme();
  }

  /**
   * useDarkTheme
   *
   * User selected dark theme manually.
   * - 'Auto' options are hidden
   * - Timer and clock are reset
   * - Run setDarkTheme()
   */
  function useDarkTheme() {
    themeAutoOptions.setAttribute('data-theme-auto-options', 'hide');
    clearInterval(timer);
    clock.innerHTML = '';
    setDarkTheme();
  }

  /**
   * useAmbientLight
   *
   * Use ambient light sensor for theme switching.
   *
   * Ref: https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor
   */
  function useAmbientLight() {
    const sensor = new AmbientLightSensor();
    const illuminance = sensor.illuminance;

    sensor.onreading = () => {
      if (illuminance < 20) {
        setDarkTheme();
      } else if (illluminance > 30) {
        setLightTheme();
      }
    };

    sensor.onerror = ({ error }) => {
      console.log(error.name, error.message);
      alert(`${error.message}. Please use your location.`);
    };

    sensor.start();
  }

  /**
   * useLocation
   *
   * Use geolocation for theme switching.
   *
   * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
   */
  function useLocation() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    function onSuccess ({ coords }) {
      const { latitude, longitude } = coords;
      let { sunrise, sunset } = SunCalc.getTimes(currentTime, latitude, longitude);

      (currentTime > sunrise && currentTime < sunset)
        ? setLightTheme()
        : setDarkTheme();
    }

    function onError(error) {
      console.warn(`ERROR(${error.code}): ${error.message}`);
    }
  }

  /**
   * useSystem
   *
   * When available, use system setting for theme.
   * Removes any previously set theme classes.
   *
   * Ref: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
   */
  function useSystem() {
    document.body.classList.remove('theme--dark');
    document.body.classList.remove('theme--light');
  }

  /**
   * adjustTimer
   *
   * When 'location' is use for theme switching we can speed up time for demo purposes.
   */
  function adjustTimer() {
    timer = setInterval(() => {
      currentTime.setHours(currentTime.getHours() + 1);
      clock.innerHTML = `${currentTime.getHours()}:59`;
      useLocation();
    }, 1000);
  }

  // Feature detections for Ambient Light Sensor
  if ('AmbientLightSensor' in window) {
    // show the button
    buttonThemeAmbient.parentElement.removeAttribute('hidden');
  }

  // Feature detections for geolocation
  if ('geolocation' in navigator) {
    // show the button
    buttonThemeLocation.parentElement.removeAttribute('hidden');
  }
})();
