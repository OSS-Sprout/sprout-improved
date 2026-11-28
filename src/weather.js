const COORDINATES = {
  latitude: 36.1022, // Open-Meteo를 호출할 기본값 한동대 좌표 (협업가이드 v2)
  longitude: 129.3898,
  name: "한동대학교",
};

const WEATHER_KEY = "sprout_weather_v1"; // 날씨 키
const ONE_HOUR = 60 * 60 * 1000; // 60 * 60 * 1000 밀리초 = 1시간

export const THRESHOLD = {
  chanceOfRain: 70, // 강수확률
  precipitation: 5, // 강수량
};

// API 실패여도 안전하게 접근할 수 있도록 기본 구조 정의
const DEFAULT_WEATHER = {
  current: { temp: null, dewPoint: null, humidity: null, weatherCode: null },
  today: {
    rainSum: null,
    rainProb: null,
    maxTemp: null,
    minTemp: null,
    radiation: null,
    et0: null,
    windMax: null,
  },
  tomorrow: {
    rainSum: null,
    rainProb: null,
    maxTemp: null,
    minTemp: null,
    radiation: null,
    et0: null,
    windMax: null,
  },
};

// Open-Meteo로 요청하기 전 1시간 안에 이미 받아둔 데이터가 있는지 확인
export async function fetchWeather(coords = COORDINATES) {
  const cacheKey = WEATHER_KEY + "_" + coords.latitude + "_" + coords.longitude;

  try {
    const rawCache = localStorage.getItem(cacheKey);
    if (rawCache) {
      const parsed = JSON.parse(rawCache);
      const isValid = Date.now() - parsed.timestamp < ONE_HOUR;
      if (isValid && parsed.data) return parsed.data;
    }
  } catch {} // 캐시가 읽으려는 시도가 실패하면 (시크릿모드 등) 그냥 넘어감

  // Open-Meteo API
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,dew_point_2m,relative_humidity_2m,weather_code&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,shortwave_radiation_sum,et0_fao_evapotranspiration,wind_speed_10m_max&timezone=Asia%2FSeoul&forecast_days=2`;

  // API 요청
  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error("HTTP Error");
    const datas = await response.json();

    // 필요한 날씨 데이터 추출하여 객체로 구조화
    const weatherData = {
      current: {
        temp: datas.current?.temperature_2m ?? null,
        dewPoint: datas.current?.dew_point_2m ?? null,
        humidity: datas.current?.relative_humidity_2m ?? null,
        weatherCode: datas.current?.weather_code ?? null,
      },
      today: {
        rainSum: datas.daily?.precipitation_sum?.[0] ?? null,
        rainProb: datas.daily?.precipitation_probability_max?.[0] ?? null,
        maxTemp: datas.daily?.temperature_2m_max?.[0] ?? null,
        minTemp: datas.daily?.temperature_2m_min?.[0] ?? null,
        radiation: datas.daily?.shortwave_radiation_sum?.[0] ?? null,
        et0: datas.daily?.et0_fao_evapotranspiration?.[0] ?? null,
        windMax: datas.daily?.wind_speed_10m_max?.[0] ?? null,
      },
      tomorrow: {
        rainSum: datas.daily?.precipitation_sum?.[1] ?? null,
        rainProb: datas.daily?.precipitation_probability_max?.[1] ?? null,
        maxTemp: datas.daily?.temperature_2m_max?.[1] ?? null,
        minTemp: datas.daily?.temperature_2m_min?.[1] ?? null,
        radiation: datas.daily?.shortwave_radiation_sum?.[1] ?? null,
        et0: datas.daily?.et0_fao_evapotranspiration?.[1] ?? null,
        windMax: datas.daily?.wind_speed_10m_max?.[1] ?? null,
      },
    };
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          timestamp: Date.now(),
          data: weatherData,
        })
      );
    } catch {}

    return weatherData;
  } catch (error) {
    console.warn("날씨 데이터 불러오기를 실패했습니다");
    return structuredClone(DEFAULT_WEATHER); // 만약 반환받은 속성을 수정하더라도 원본이 바뀌지 않도록 복사해놓기
  }
}
