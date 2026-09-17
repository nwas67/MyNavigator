const map = L.map('map').setView([55.751244, 37.618423], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker = null;

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const locationButton = document.getElementById('locationButton');
const results = document.getElementById('results');

async function searchPlace() {
    const query = searchInput.value.trim();

    if (!query) {
        return;
    }

    results.innerHTML = 'Поиск...';

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        results.innerHTML = '';

        if (!data.length) {
            results.innerHTML = 'Ничего не найдено';
            return;
        }

        data.forEach(place => {
            const item = document.createElement('div');

            item.textContent = place.display_name;
            item.className = 'result-item';

            item.onclick = () => {
                const lat = Number(place.lat);
                const lon = Number(place.lon);

                map.setView([lat, lon], 16);

                if (marker) {
                    map.removeLayer(marker);
                }

                marker = L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(place.display_name)
                    .openPopup();

                results.innerHTML = '';
            };

            results.appendChild(item);
        });

    } catch (error) {
        console.error(error);
        results.innerHTML = 'Ошибка поиска';
    }
}

searchButton.addEventListener('click', searchPlace);

searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        searchPlace();
    }
});

locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Ваш браузер не поддерживает геолокацию');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            map.setView([lat, lon], 16);

            if (marker) {
                map.removeLayer(marker);
            }

            marker = L.marker([lat, lon])
                .addTo(map)
                .bindPopup('Вы здесь')
                .openPopup();
        },
        error => {
            console.error(error);
            alert('Не удалось определить местоположение');
        }
    );
});
