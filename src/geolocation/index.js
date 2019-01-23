(() => {
  const clock = document.getElementById('clock');
  const sunriseClock = document.getElementById('sunrise');
  const sunsetClock = document.getElementById('sunset');
  const output = document.querySelector('[data-demo-output]');

  function setLightTheme() {
    document.body.classList.add('theme--light');
    document.body.classList.remove('theme--dark');
  }

  function setDarkTheme() {
    document.body.classList.add('theme--dark');
    document.body.classList.remove('theme--light');
  }

  function updateCurrentTheme(currentTime, sunrise, sunset) {
    currentTime > sunrise && currentTime < sunset
      ? setLightTheme()
      : setDarkTheme();
  }

  if ('geolocation' in navigator) {
    output.innerHTML = 'Supported';
    navigator.geolocation.getCurrentPosition(position => {
      let currentTime = new Date();
      const { latitude, longitude } = position.coords;

      setInterval(() => {
        currentTime.setHours(currentTime.getHours() + 1);
        clock.innerHTML = `${currentTime.getHours()}:59`;
        const { sunrise, sunset } = SunCalc.getTimes(
          currentTime,
          latitude,
          longitude,
        );

        sunriseClock.innerHTML = `${sunrise.getHours()}:${sunrise.getMinutes()}`;
        sunsetClock.innerHTML = `${sunset.getHours()}:${sunset.getMinutes()}`;
        updateCurrentTheme(currentTime, sunrise, sunset);
      }, 1000);
    });
  } else {
    output.innerHTML = 'Not supported';
  }
})();
