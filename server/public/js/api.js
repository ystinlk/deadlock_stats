export function get_leaderboard() {
    const regions = [
    "Europe",
    "Asia",
    "NAmerica",
    "SAmerica",
    "Oceania"]

    return regions.map(region =>
    fetch(`https://api.deadlock-api.com/v1/leaderboard/${region}`)
      .then(r => {
        if (!r.ok) throw new Error(`Ошибка ${r.status}`)
        return r.json()
    })
)}

export function get_heroes() {
    return fetch("https://api.deadlock-api.com/v1/assets/heroes").then(r =>{
    if (!r.ok) throw new Error(`Ошибка ${r.status}`);
    return r.json()
    })}

export function get_stats() {
    return fetch("https://api.deadlock-api.com/v1/analytics/hero-stats").then(r =>{
    if (!r.ok) throw new Error(`Ошибка ${r.status}`);
    return r.json()
    })}

export function Steam_ID_find(QUERY) {
    return fetch(`https://api.deadlock-api.com/v1/players/steam-search?search_query=${QUERY}`)
    .then(r => {if (!r.ok) throw new Error(`Ошибка ${r.status}`) 
    return r.json()})
}