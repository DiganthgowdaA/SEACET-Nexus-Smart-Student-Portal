'use strict';
/* ================================================
   SEACET Nexus — Weather Widget
   ================================================ */
const WeatherWidget = (() => {
  const API_KEY = '4d8fb5b93d4af21d66a2948710284366';
  const CITY = 'Bangalore';
  const CACHE_KEY = 'weather_cache';

  const getWeatherEmoji = (code) => {
    if (code >= 200 && code < 300) return '⛈️';
    if (code >= 300 && code < 400) return '🌧️';
    if (code >= 500 && code < 600) return '🌧️';
    if (code >= 600 && code < 700) return '❄️';
    if (code >= 700 && code < 800) return '🌫️';
    if (code === 800) return '☀️';
    if (code === 801) return '🌤️';
    if (code >= 802 && code <= 804) return '☁️';
    return '🌡️';
  };

  const fetchWeather = async () => {
    const el = document.getElementById('weatherInfo');
    if (!el) return;
    try {
      const cached = StorageManager.get(CACHE_KEY);
      if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) {
        displayWeather(cached.data, el);
        return;
      }
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      StorageManager.set(CACHE_KEY, { data, timestamp: Date.now() });
      displayWeather(data, el);
    } catch {
      const fallback = '24°C ☀️ Sunny';
      el.textContent = fallback;
      const heroEl = document.getElementById('heroWeather');
      if (heroEl) heroEl.textContent = `Bangalore — ${fallback}`;
    }
  };

  const displayWeather = (data, el) => {
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].main;
    const emoji = getWeatherEmoji(data.weather[0].id);
    const text = `${temp}°C ${emoji} ${desc}`;
    el.textContent = text;
    const heroEl = document.getElementById('heroWeather');
    if (heroEl) heroEl.textContent = `Bangalore — ${text}`;
  };

  const init = () => { fetchWeather(); setInterval(fetchWeather, 30 * 60 * 1000); };

  return { init };
})();
