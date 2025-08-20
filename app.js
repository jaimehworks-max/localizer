(() => {
  'use strict';

  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');
  const locationEl = document.getElementById('location');
  const tzEl = document.getElementById('timezone');

  const locale = navigator.language || 'es-CO';

  // Update time every second
  function updateTime() {
    const now = new Date();
    const time = new Intl.DateTimeFormat(locale, {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(now);
    timeEl.textContent = time;
  }

  // Set formatted date
  function updateDate() {
    const now = new Date();
    const date = new Intl.DateTimeFormat(locale, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }).format(now);
    // Capitalize first letter in Spanish locales
    dateEl.textContent = date.charAt(0).toUpperCase() + date.slice(1);
  }

  // Time zone label
  function setTimezone() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      tzEl.textContent = `Zona horaria: ${tz}`;
    } catch {
      tzEl.textContent = '';
    }
  }

  // Geolocation (approximate)
  function requestLocation() {
    if (!('geolocation' in navigator)) {
      locationEl.textContent = 'Geolocalización no soportada por el navegador.';
      return;
    }

    const opts = { enableHighAccuracy: false, maximumAge: 60_000, timeout: 10_000 };

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const lat = latitude.toFixed(4);
        const lon = longitude.toFixed(4);
        locationEl.textContent = `Lat ${lat}°, Lon ${lon}° (aprox.)`;
      },
      err => {
        // On denial or error, fall back to time zone only
        const map = {
          1: 'Permiso denegado',
          2: 'Posición no disponible',
          3: 'Tiempo de espera agotado'
        };
        locationEl.textContent = `No se pudo obtener la ubicación (${map[err.code] || 'Error'}).`;
      },
      opts
    );
  }

  // Initial paint
  updateTime();
  updateDate();
  setTimezone();
  requestLocation();

  // Tickers
  setInterval(updateTime, 1000);
  // Refresh date at midnight
  setInterval(updateDate, 60_000);
})();