//Variaveis e seleção de elementos 
const apiKey = "8de1ed37dd256de9db1102c3e4067304"; // futuramente implementar .env
const apiCountryURL = "https://flagsapi.com/";
const MAPTILER_API_KEY = 'pHZbdDh6mjoyOeFzroIV';

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");
const mainContainer = document.querySelector(".container");

// Variáveis globais para o mapa
let map;
let marker;
let defaultLatitude = -25.429722; // Curitiba latitude padrão
let defaultLongitude = -49.271944; // Curitiba longitude padrão
let mapInitialized = false; // Flag para controlar se o mapa já foi inicializado

//funções
const getWeatherData = async (city) => {
    try {
        const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
        const res = await fetch(apiWeatherURL);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do clima:", error);
        return null;
    }
};

const showWeatherData = async (city) => {
    const data = await getWeatherData(city);

    if (!data || data.cod === "404") {
        alert("Cidade não encontrada!");
        return;
    }

    cityElement.innerText = data.name;
    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;
    weatherIconElement.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    countryElement.setAttribute("src", `https://flagsapi.com/${data.sys.country}/shiny/64.png`);
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed}km/h`;

    // Extrair coordenadas da resposta da API
    const latitude = data.coord.lat;
    const longitude = data.coord.lon;

    // Inicializar ou atualizar o mapa
    if (!mapInitialized) {
        initMap();
    }

    // Atualizar o mapa com as novas coordenadas
    updateMap(latitude, longitude);

    // Adicionando a classe expanded ao container principal primeiro
    // para garantir que a transição CSS funcione corretamente
    mainContainer.classList.add("expanded");

    // Depois de um pequeno atraso, mostrar os dados do clima
    // para garantir que a transição seja suave
    setTimeout(() => {
        weatherContainer.classList.remove("hide");
        weatherContainer.classList.add("active-map");
    }, 100);
};

// Função para inicializar o mapa Leaflet
function initMap() {
    try {
        // Inicializar o mapa
        map = L.map('map').setView([defaultLatitude, defaultLongitude], 12);

        // Adicionar camada do mapa (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Adicionar marcador
        marker = L.marker([defaultLatitude, defaultLongitude]).addTo(map);

        mapInitialized = true;
        console.log("Mapa inicializado com sucesso!");
        return true;
    } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
        return false;
    }
}

// Função para atualizar o mapa com a nova localização
function updateMap(lat, lng) {
    if (map && marker) {
        // Atualizar posição do mapa
        map.setView([lat, lng], 12);

        // Atualizar posição do marcador
        marker.setLatLng([lat, lng]);
    }
}

//Eventos 
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const city = cityInput.value;

    if (city) {
        showWeatherData(city);
    }
});

cityInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        const city = e.target.value;

        if (city) {
            showWeatherData(city);
        }
    }
});

// Inicializar o mapa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM carregado, aguardando primeira busca para inicializar o mapa");
});