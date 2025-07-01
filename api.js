document.getElementById('get-weather-btn').addEventListener('click', async () => {
  const city = document.getElementById('city').value.trim();
  const result = document.getElementById('result');

  if (!city) {
    result.textContent = 'Please enter a city.';
    return;
  }

  result.textContent = 'Loading...';

  try {
    // Step 1: Get coordinates from city
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      result.textContent = 'City not found.';
      return;
    }

    const { latitude, longitude } = geoData.results[0];

    // Step 2: Get weather using the coordinates
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();

    if (!weatherData.current_weather) {
      result.textContent = 'No weather data available.';
      return;
    }

    const weather = weatherData.current_weather;

    // Display data
    result.innerHTML = `
      <strong>City:</strong> ${city}<br>
      <strong>Temperature:</strong> ${weather.temperature} °C<br>
      <strong>Wind Speed:</strong> ${weather.windspeed} km/h
    `;
  } catch (error) {
    console.error(error);
    result.textContent = 'Failed to fetch weather.';
  }
});
