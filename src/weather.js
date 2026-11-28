const COORDINATES = {
    latitude : 36.1022, // Open-Meteo를 호출할 기본값 한동대 좌표 (협업가이드 v2)
    longitude : 129.3898,
    name : "한동대학교"
}

const WEATHER_KEY = "sprout_weather_v1"; // 날씨 키
const ONE_HOUR = 60 * 60 * 1000; // 60 * 60 * 1000 밀리초 = 1시간

const THRESHOLD = {
    chanceOfRain: 70, // 강수확률
    precipitation: 5, // 강수량
    
}

// Open-Meteo로 요청하기 전 1시간 안에 이미 받아둔 데이터가 있는지 확인
export async function fetchWeather(coords = COORDINATES) {
    const cacheKey = WEATHER_KEY + '_' + coords.latitude + '_' + coords.longitude;

    try { 
        const rawCache = localStorage.getItem(cacheKey); 
        if (rawCache){
            const parsed = JSON.parse(rawCache); 
            const isValid = Date.now() - parsed.timestamp < ONE_HOUR;
            if(isValid && parsed.data) return parsed.data; 
        }
    } catch {} // 캐시가 읽으려는 시도가 실패하면 (시크릿모드 등) 그냥 넘어감

    // Open-Meteo API
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,dew_point_2m,relative_humidity_2m,weather_code&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,shortwave_radiation_sum,et0_fao_evapotranspiration,wind_speed_10m_max&timezone=Asia%2FSeoul&forecast_days=2`;
    // API 요청
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("HTTP Error");
        const datas = await response.json();

        localStorage.setItem(
            cacheKey,
            JSON.stringify({
                timestamp: Date.now(),
                data: datas
            })
        );
        return datas;
    } catch(error) {
        console.warn("날씨 데이터 불러오기를 실패했습니다");
        return null; // 날씨를 못  받아오면 원래 주기로 작동함
    }
}
