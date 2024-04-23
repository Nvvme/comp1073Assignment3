// Global API Keys
const weatherApiKey = '799a848d03774a1089d222939242204'; // :)
const mapboxApiKey = 'pk.eyJ1IjoiYnJvbmVuYXYiLCJhIjoiY2x2YmhvdjZtMDJ4ZDJrbGhzOGpxZmFlYSJ9.s8IBTZadzBY940KG_AUpOQ'; // this is my map box key // :))

// WeatherAPI Documentation: https://www.weatherapi.com/docs/
// Fetches weather data using WeatherAPI
async function getWeather(location) {
    const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}&aqi=no`;
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();
        if (!response.ok || data.error) {  // Check if the API response contains an error
            throw new Error('Location not found');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        return { error: error.message };  // Return an object containing the error message
    }
}

// Displays weather data fetched from WeatherAPI and changes background based on the weather
function displayWeather(data) {
    const weatherDisplay = document.getElementById('weather-display');
    const body = document.body;

    if (data && !data.error) {
        const weatherCondition = data.current.condition.text.toLowerCase();
        let emoji = '';
        switch (true) {  // Determine the emoji and background color based on the weather condition
            case weatherCondition.includes('sunny'):
                emoji = '☀️';
                body.style.backgroundColor = '#F7DC6F';
                break;
            case weatherCondition.includes('clear'):
                emoji = '🌟';
                body.style.backgroundColor = '#0066cc';
                break;
            case weatherCondition.includes('rain'):
                emoji = '🌧️';
                body.style.backgroundColor = '#85C1E9';
                break;
            case weatherCondition.includes('snow'):
                emoji = '❄️';
                body.style.backgroundColor = '#D6EAF8';
                break;
            case weatherCondition.includes('cloud'):
                emoji = '☁️';
                body.style.backgroundColor = '#454545';
                break;
            default:
                emoji = '🌍';
                body.style.backgroundColor = '#82E0AA';
        }

        weatherDisplay.innerHTML = `<h2>Weather in ${data.location.name} ${emoji}</h2>
                                    <p>Temperature: ${data.current.temp_c} °C</p>
                                    <p>Weather: ${data.current.condition.text}</p>`;
    } else {
        // Display an error message if the location is not found or another error occurs
        weatherDisplay.innerHTML = `<h2>${data.error || "Weather data unavailable"}</h2>`;
        body.style.backgroundColor = '#ECF0F1';  // Default background color
    }
}

// Mapbox API Documentation: https://docs.mapbox.com/api/
// Initializes and displays a map using Mapbox
function initMap(lat, lon) {
    mapboxgl.accessToken = mapboxApiKey;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lon, lat],
        zoom: 12
    });

    new mapboxgl.Marker()
        .setLngLat([lon, lat])
        .addTo(map);
}

// Controls the main flow of the application, fetching weather and initializing the map
async function getWeatherAndPlaces() {
    const location = document.getElementById('location-input').value;
    const weatherData = await getWeather(location);
    if (weatherData && !weatherData.error) {
        displayWeather(weatherData);
        initMap(weatherData.location.lat, weatherData.location.lon);
    } else {
        displayWeather(weatherData);  // This will handle displaying errors to the user
    }
}

// Adds event listener for the input box to trigger data fetch and display on 'Enter' key press
document.getElementById('location-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeatherAndPlaces();
    }
});
