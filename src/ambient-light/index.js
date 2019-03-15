(() => {
  const illuminanceElement = document.getElementById('illuminance');
  const output = document.querySelector('[data-demo-output]');

  function setLightTheme() {
    document.body.classList.add('theme--light');
    document.body.classList.remove('theme--dark');
  }

  function setDarkTheme() {
    document.body.classList.add('theme--dark');
    document.body.classList.remove('theme--light');
  }

  if ('AmbientLightSensor' in window) {
    output.innerHTML = 'Supported';
    try {
      const sensor = new AmbientLightSensor();

      sensor.onreading = () => {
        const illuminance = sensor.illuminance;

        illuminanceElement.innerHTML = illuminance;

        if (illuminance < 20) {
          setDarkTheme();
        } else if (illluminance > 30) {
          setLightTheme();
        }
      };

      sensor.onerror = ({ error }) => {
        output.innerHTML = 'Not supported';
      };

      sensor.start();
    } catch (e) {
      console.error(e);
    }
  } else {
    output.innerHTML = 'Not supported';
  }
})();
