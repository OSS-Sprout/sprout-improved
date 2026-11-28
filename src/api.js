const BASE_URL = import.meta.env.VITE_MOCKAPI_URL;

async function request(path, options){
    if(!BASE_URL){
        throw new Error("VITE_MOCKAPI_URL이 설정되지 않았습니다. .env.local을 확인하세요.");
    }

    const response = await fetch(`${BASE_URL}${path}`, options);

    if(!response.ok){
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
}

export function fetchPlants(){
    return request("/plants");
}

export function createPlant(plant){
    return request("/plants", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(plant),
    });
}

export function updatePlant(plant){
    return request(`/plants/${plant.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(plant),
    });
}