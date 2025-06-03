document.addEventListener('DOMContentLoaded', () => {
  const lightSwitch = document.getElementById('light-switch');
  const html = document.documentElement;

  // Set initial state
  if (localStorage.getItem('dark-mode') === 'true') {
    html.classList.add('dark');
    lightSwitch.checked = true;
  }

  // Toggle dark mode
  lightSwitch.addEventListener('change', () => {
    if (lightSwitch.checked) {
      html.classList.add('dark');
      localStorage.setItem('dark-mode', 'true');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('dark-mode', 'false');
    }
  });
}); 