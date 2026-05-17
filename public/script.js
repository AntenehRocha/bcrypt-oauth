$(document).ready(function() {
    let currentUser = null;
    let currentFavorites = [];

    // Initialize: Fetch user info and favorites
    fetchUserInfo();
    fetchFavorites();

    function fetchUserInfo() {
        $.get("/api/user", function(user) {
            currentUser = user;
            $("#user-name").text(user.nombre || user.username);
        });
    }

    function fetchFavorites() {
        $.get("/api/favorites", function(favs) {
            currentFavorites = favs;
            renderFavorites();
        });
    }

    function renderFavorites() {
        const $list = $("#favorites-list");
        $list.empty();
        if (currentFavorites.length === 0) {
            $list.append("<p style=\"font-size:0.8rem; color:rgba(255,255,255,0.4)\">No tienes ciudades favoritas aún.</p>");
        }
        currentFavorites.forEach(city => {
            $list.append(`
                <li class="favorite-item" data-city="${city}">
                    <span>${city}</span>
                    <span class="remove-fav">&times;</span>
                </li>
            `);
        });
    }

    // Search Weather
    $("#search-btn").click(function() {
        const city = $("#city-input").val();
        if (city) fetchWeather(city);
    });

    $("#city-input").keypress(function(e) {
        if (e.which == 13) $("#search-btn").click();
    });

    async function fetchWeather(cityName) {
        $("#weather-display").html("<p>Cargando...</p>");
        try {
            // 1. Geocoding
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=es`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                $("#weather-display").html("<p>Ciudad no encontrada.</p>");
                return;
            }

            const { latitude, longitude, name, country, admin1 } = geoData.results[0];
            const fullName = `${name}${admin1 ? ", " + admin1 : ""}`;

            // 2. Forecast
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`);
            const weatherData = await weatherRes.json();

            displayWeather(fullName, weatherData.current_weather);
        } catch (err) {
            console.error(err);
            $("#weather-display").html("<p>Error al obtener el clima.</p>");
        }
    }

    function displayWeather(city, current) {
        const isFav = currentFavorites.includes(city);
        const starClass = isFav ? "active" : "";

        $("#weather-display").html(`
            <div class="city-name">
                ${city} 
                <span class="fav-star ${starClass}" data-city="${city}">★</span>
            </div>
            <div class="temp">${Math.round(current.temperature)}°C</div>
            <div class="weather-details">
                <span>Viento: ${current.windspeed} km/h</span>
                <span>Código: ${current.weathercode}</span>
            </div>
        `);
    }

    // Favorite Interaction
    $(document).on("click", ".fav-star", function() {
        const city = $(this).data("city");
        const isActive = $(this).hasClass("active");

        if (isActive) {
            removeFavorite(city);
        } else {
            addFavorite(city);
        }
    });

    $(document).on("click", ".remove-fav", function(e) {
        e.stopPropagation();
        const city = $(this).parent().data("city");
        removeFavorite(city);
    });

    $(document).on("click", ".favorite-item", function() {
        const city = $(this).data("city");
        fetchWeather(city);
    });

    function addFavorite(city) {
        $.ajax({
            url: "/api/favorites",
            type: "POST",
            data: JSON.stringify({ city }),
            contentType: "application/json",
            success: function(favs) {
                currentFavorites = favs;
                renderFavorites();
                $(".fav-star[data-city=\"" + city + "\"]").addClass("active");
            }
        });
    }

    function removeFavorite(city) {
        $.ajax({
            url: "/api/favorites",
            type: "DELETE",
            data: JSON.stringify({ city }),
            contentType: "application/json",
            success: function(favs) {
                currentFavorites = favs;
                renderFavorites();
                $(".fav-star[data-city=\"" + city + "\"]").removeClass("active");
            }
        });
    }
});
