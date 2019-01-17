(function() {
  if ('AmbientLightSensor' in window) {
    try {
      const sensor = new AmbientLightSensor();

      sensor.onreading = () => {
        const illuminance = sensor.illuminance;

        if (illuminance < 20) {
          document.body.className = 'dark-theme';
        } else if (illluminance > 30) {
          document.body.className = 'light-theme';
        }
      };

      sensor.onerror = e => {
        console.log(e.error.name, e.error.message);
      };

      sensor.start();
    } catch (e) {
      console.error(e);
    }
  }
})();
