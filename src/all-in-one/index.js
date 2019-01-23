(function() {
  // Element variables
  const buttonThemeAuto = document.getElementById('themeAuto');
  const buttonThemeDark = document.getElementById('themeDark');
  const buttonThemeLight = document.getElementById('themeLight');
  const feedbackMessage = document.getElementById('feedbackMessage');
  const themeSettings = document.querySelector('[data-theme-settings]');

  // Events
  buttonThemeAuto.addEventListener('click', useAutoMode, false);
  buttonThemeDark.addEventListener('click', useDarkTheme, false);
  buttonThemeLight.addEventListener('click', useLightTheme, false);
  themeSettings.addEventListener('click', showSettings, false);

  let timer = null;

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
   * useLightTheme
   *
   * User selected light theme manually.
   * - Run setLightTheme()
   */
  function useLightTheme() {
    setLightTheme();
    feedbackMessage.innerHTML = 'Manual Controls';
  }

  /**
   * useDarkTheme
   *
   * User selected dark theme manually.
   * - Run setDarkTheme()
   */
  function useDarkTheme() {
    setDarkTheme();
    feedbackMessage.innerHTML = 'Manual Controls';
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
    feedbackMessage.innerHTML = 'CSS Feature Toggle';
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
      feedbackMessage.innerHTML = 'Ambient Light Sensor';
    };

    sensor.onerror = ({ error }) => {
      console.warn(`ERROR(${error.name}): ${error.message}`);
      useLocation(); // If the Ambient Light Sensor is not working, fallback to Geolocation.
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
      maximumAge: 0,
      timeout: 5000,
    };

    clearInterval(timer);
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    function onSuccess({ coords }) {
      let currentTime = new Date();
      const { latitude, longitude } = coords;

      timer = setInterval(() => {
        if (buttonThemeAuto.checked) {
          currentTime.setHours(currentTime.getHours() + 1);

          const { sunrise, sunset } = SunCalc.getTimes(
            currentTime,
            latitude,
            longitude,
          );

          currentTime > sunrise && currentTime < sunset
            ? setLightTheme()
            : setDarkTheme();

          feedbackMessage.innerHTML = `
          Geolocation (Current Simutated Time: ${currentTime.getHours()}:59
        `;
        }
      }, 1000);
    }

    function onError(error) {
      console.warn(`ERROR(${error.code}): ${error.message}`);
    }
  }

  /**
   * useAutoMode
   *
   * Automatically selects the best option based on feature detection.
   */
  function useAutoMode() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      useSystem();
    } else if ('AmbientLightSensor' in window) {
      useAmbientLight();
    } else if ('geolocation' in navigator) {
      useLocation();
    }
  }
})();
