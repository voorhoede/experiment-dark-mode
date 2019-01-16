(function() {
  const clock = document.getElementById('clock');

  function logData(currentTime, sunrise, sunset) {
    console.table({
      currentTime: String(currentTime),
      sunrise: String(sunrise),
      sunset: String(sunset),
    });
  }

  function setLightTheme() {
    document.body.className = 'light-theme';
  }

  function setDarkTheme() {
    document.body.className = 'dark-theme';
  }

  function updateCurrentTheme(currentTime, sunrise, sunset) {
    currentTime > sunrise && currentTime < sunset
      ? setLightTheme()
      : setDarkTheme();
    logData(currentTime, sunrise, sunset);
  }

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      let currentTime = new Date();
      const { latitude, longitude } = position.coords;

      setInterval(() => {
        // const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        clock.innerHTML = `${currentTime.getHours()}:59`;
        const { sunrise, sunset } = SunCalc.getTimes(
          currentTime,
          latitude,
          longitude,
        );

        updateCurrentTheme(currentTime, sunrise, sunset);
      }, 500);
    });
  }
})();
