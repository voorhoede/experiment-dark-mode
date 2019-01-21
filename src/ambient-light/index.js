(() => {
  const illuminanceElement = document.getElementById('illuminance');

  function setLightTheme() {
    document.body.classList.add('theme--light');
    document.body.classList.remove('theme--dark');
  }

  function setDarkTheme() {
    document.body.classList.add('theme--dark');
    document.body.classList.remove('theme--light');
  }

  if ('AmbientLightSensor' in window) {
    try {
      const sensor = new AmbientLightSensor();

      sensor.onreading = () => {
        const illuminance = sensor.illuminance;

        illuminanceElement.innerHTML = `Illuminance: ${illuminance}`;

        if (illuminance < 20) {
          setDarkTheme();
        } else if (illluminance > 30) {
          setLightTheme();
        }
      };

      sensor.onerror = ({ error }) => {
        console.log(error.name, error.message);
      };

      sensor.start();
    } catch (e) {
      console.error(e);
    }
  }
})();
