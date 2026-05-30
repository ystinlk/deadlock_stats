export function get_leaderboard() {
    return fetch(`/api/leaderboard`)
    .then(r => {if (!r.ok) throw new Error(`Ошибка ${r.status}`) 
    return r.json()})
}
export function get_heroes() {
    return fetch("/api/heroes").then(r =>{
    if (!r.ok) throw new Error(`Ошибка ${r.status}`);
    return r.json().then(r => r.heroes)
    })}

export function get_stats() {
    return fetch("/api/heroes").then(r =>{
    if (!r.ok) throw new Error(`Ошибка ${r.status}`);
    return r.json().then(r => r.hero_stats)
    })}

export function Steam_ID_find(QUERY) {
    return fetch(`/api/players?search=${QUERY}`)
    .then(r => {if (!r.ok) throw new Error(`Ошибка ${r.status}`) 
    return r.json()})
}