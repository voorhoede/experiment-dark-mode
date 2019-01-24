(() => {
  const clock = document.getElementById('clock');
  const sunriseClock = document.getElementById('sunrise');
  const sunsetClock = document.getElementById('sunset');
  const output = document.querySelector('[data-demo-output]');

  const ACCESS_KEY = 'f548fc3dba5f99a9a89d5c4e114c56e3'; // This is 100% safe, trust me.

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

  function useGeolocation(position) {
    const { latitude, longitude } = position.coords;
    output.innerHTML = 'Supported: Permission Granted';
    updateClocks(latitude, longitude);
  }

  function useIPAddress() {
    fetch(`http://api.ipapi.com/check?access_key=${ACCESS_KEY}`)
      .then(response => response.json())
      .then(data => {
        const { latitude, longitude } = data;
        output.innerHTML = 'Supported: Permission Denied';
        updateClocks(latitude, longitude);
      })
      .catch(err => {
        output.innerHTML = 'Not supported';
      });
  }

  function updateClocks(latitude, longitude) {
    let currentTime = new Date();

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
  }

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => useGeolocation(position),
      useIPAddress,
    );
  } else {
    output.innerHTML = 'Not supported';
    useIPAddress();
  }
})();
