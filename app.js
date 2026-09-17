// ========================================
// MY NAVIGATOR
// ========================================

// -------------------------
// Карта
// -------------------------

const map = L.map("map", {
    zoomControl: true
}).setView([55.751244, 37.618423], 10);

// -------------------------
// OpenStreetMap
// -------------------------

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

// -------------------------
// Переменные
// -------------------------

let userLocation = null;
let userMarker = null;
let destinationMarker = null;
let routeLine = null;

// -------------------------
// Элементы интерфейса
// -------------------------

const destinationInput =
    document.getElementById("destination");

const searchButton =
    document.getElementById("searchButton");

const searchResults =
    document.getElementById("searchResults");

const locationButton =
    document.getElementById("locationButton");

const routeInfo =
    document.getElementById("routeInfo");

const distanceElement =
    document.getElementById("distance");

const durationElement =
    document.getElementById("duration");

const clearRouteButton =
    document.getElementById("clearRoute");

// -------------------------
// Получение геолокации
// -------------------------

function getLocation() {

    if (!navigator.geolocation) {

        alert(
            "Ваш браузер не поддерживает геолокацию."
        );

        return;
    }

    locationButton.innerHTML =
        "⏳ Определяем местоположение...";

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            userLocation = [
                latitude,
                longitude
            ];

            updateUserMarker();

            map.setView(
                userLocation,
                16
            );

            locationButton.innerHTML =
                "📍 Моё местоположение";
        },

        function(error) {

            console.error(error);

            locationButton.innerHTML =
                "📍 Моё местоположение";

            alert(
                "Не удалось определить местоположение.\n\n" +
                "Разреши доступ к геолокации в браузере."
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
        }
    );
}

// -------------------------
// Маркер пользователя
// -------------------------

function updateUserMarker() {

    if (!userLocation) {
        return;
    }

    const icon = L.divIcon({

        className: "",

        html:
            '<div class="current-location-marker"></div>',

        iconSize: [20, 20],

        iconAnchor: [10, 10]
    });

    if (!userMarker) {

        userMarker = L.marker(
            userLocation,
            {
                icon: icon
            }
        ).addTo(map);

    } else {

        userMarker.setLatLng(
            userLocation
        );
    }
}

// -------------------------
// Поиск адреса
// -------------------------

async function searchDestination() {

    const query =
        destinationInput.value.trim();

    if (!query) {
        return;
    }

    searchResults.style.display =
        "block";

    searchResults.innerHTML =
        '<div class="search-result">🔎 Ищем...</div>';

    try {

        const url =
            "https://nominatim.openstreetmap.org/search" +
            "?format=json" +
            "&limit=5" +
            "&addressdetails=1" +
            "&q=" +
            encodeURIComponent(query);

        const response =
            await fetch(url, {
                headers: {
                    "Accept-Language": "ru"
                }
            });

        if (!response.ok) {
            throw new Error(
                "Ошибка поиска"
            );
        }

        const results =
" мин";
        }

        // Удаляем старую линию

        if (routeLine) {

            map.removeLayer(
                routeLine
            );
        }

        // Рисуем новую

        routeLine =
            L.geoJSON(
                route.geometry,
                {
                    style: {
                        weight: 6
                    }
                }
            ).addTo(map);

        // Показываем весь маршрут

        map.fitBounds(
            routeLine.getBounds(),
            {
                padding: [80, 80]
            }
        );

    }

    catch (error) {

        console.error(error);

        durationElement.textContent =
            "Ошибка";

        alert(
            "Не удалось построить маршрут."
        );
    }
}

// -------------------------
// Очистка маршрута
// -------------------------

function clearRoute() {

    if (routeLine) {

        map.removeLayer(
            routeLine
        );

        routeLine = null;
    }

    if (destinationMarker) {

        map.removeLayer(
            destinationMarker
        );

        destinationMarker = null;
    }

    routeInfo.classList.add(
        "hidden"
    );

    destinationInput.value = "";
}

// -------------------------
// Кнопки
// -------------------------

locationButton.addEventListener(
    "click",
    getLocation
);

searchButton.addEventListener(
    "click",
    searchDestination
);

clearRouteButton.addEventListener(
    "click",
    clearRoute
);

// -------------------------
// Поиск через Enter
// -------------------------

destinationInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            searchDestination();
        }
    }
);

// -------------------------
// Автоматически запрашиваем
// местоположение
// -------------------------

getLocation();


await response.json();

        displaySearchResults(results);

    }

    catch (error) {

        console.error(error);

        searchResults.innerHTML =
            '<div class="search-result">' +
            "❌ Ошибка поиска" +
            "</div>";
    }
}

// -------------------------
// Показ результатов
// -------------------------

function displaySearchResults(results) {

    searchResults.innerHTML = "";

    if (!results.length) {

        searchResults.innerHTML =
            '<div class="search-result">' +
            "Ничего не найдено" +
            "</div>";

        return;
    }

    results.forEach(function(result) {

        const element =
            document.createElement("div");

        element.className =
            "search-result";

        element.textContent =
            result.display_name;

        element.addEventListener(
            "click",
            function() {

                selectDestination(
                    parseFloat(result.lat),
                    parseFloat(result.lon),
                    result.display_name
                );

            }
        );

        searchResults.appendChild(
            element
        );

    });
}

// -------------------------
// Выбор места
// -------------------------

function selectDestination(
    latitude,
    longitude,
    name
) {

    const destination = [
        latitude,
        longitude
    ];

    searchResults.style.display =
        "none";

    destinationInput.value =
        name;

    if (destinationMarker) {

        map.removeLayer(
            destinationMarker
        );
    }

    destinationMarker =
        L.marker(destination)
            .addTo(map)
            .bindPopup(name)
            .openPopup();

    map.setView(
        destination,
        15
    );

    if (userLocation) {

        buildRoute(
            userLocation,
            destination
        );

    } else {

        alert(
            "Сначала разреши доступ к местоположению."
        );

        getLocation();
    }
}

// -------------------------
// Построение маршрута
// -------------------------

async function buildRoute(
    start,
    end
) {

    routeInfo.classList.remove(
        "hidden"
    );

    distanceElement.textContent =
        "—";

    durationElement.textContent =
        "Строим...";

    try {

        const startLon =
            start[1];

        const startLat =
            start[0];

        const endLon =
            end[1];

        const endLat =
            end[0];

        const url =
            "https://router.project-osrm.org/route/v1/driving/" +
            `${startLon},${startLat};${endLon},${endLat}` +
            "?overview=full" +
            "&geometries=geojson";

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Ошибка маршрутизации"
            );
        }

        const data =
            await response.json();

        if (
            !data.routes ||
            !data.routes.length
        ) {

            throw new Error(
                "Маршрут не найден"
            );
        }

        const route =
            data.routes[0];

        const distance =
            route.distance;

        const duration =
            route.duration;

        // Километры

        const kilometers =
            distance / 1000;

        if (kilometers < 1) {

            distanceElement.textContent =
                Math.round(distance) + " м";

        } else {

            distanceElement.textContent =
                kilometers.toFixed(1) + " км";
        }

        // Минуты

        const minutes =
            Math.round(duration / 60);

        if (minutes < 60) {

            durationElement.textContent =
                minutes + " мин";

        } else {

            const hours =
                Math.floor(minutes / 60);

            const mins =
                minutes % 60;

            durationElement.textContent =
                hours +
                " ч " +
                mins +