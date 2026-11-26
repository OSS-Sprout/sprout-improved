import axios from "axios";

const COORDINATES = {
    latitude : 36.1022, // Open-Meteo를 호출할 한동대 좌표 (협업가이드 v2)
    longitude : 129.3898,
    name : "한동대학교" // 추후 이름이 필요하거나 한동대 뿐 아니라 확장 가능성을 만들기 위해 name을 추가
}

const WEATHER_KEY = "sprout_weather_v1"; // 날씨 키
const ONE_HOUR = 60 * 60 * 1000; // 60 * 60 * 1000 밀리초 = 1시간

const THRESHOLD = {
    chanceOfRain: 70, // 강수확률
    precipitation: 5, // 강수량
    
}

// Open-Meteo로 요청하기 전 1시간 안에 이미 받아둔 데이터가 있는지 확인
async function fetchWeather(coords = COORDINATES) {
    try { 
        const rawCache = localStorage.getItem(WEATHER_KEY); 
        if (rawCache){
            const parsed = JSON.parse(rawCache); 
            const isValid = Date.now() - parsed.timestamp < ONE_HOUR;
            if(isValid && parsed.data) return parsed.data; 
        }
    } catch {} // 캐시가 읽으려는 시도가 실패하면 (시크릿모드 등) 그냥 넘어감

    // Open-Meteo API
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FSeoul&forecast_days=3';


    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("HTTP Error");
        const datas = await response.json();
    } catch{}
}
