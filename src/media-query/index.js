(() => {
  const output = document.querySelector('[data-demo-output]');
  const supportsMediaQuery = window.matchMedia('(prefers-color-scheme: dark)').matches;

  supportsMediaQuery
    ? output.innerHTML = 'Supported'
    : output.innerHTML = 'Not supported';
})();
