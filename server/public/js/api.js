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
export function get_player_matches(account_id) {
    return fetch(`/api/profile/${account_id}/match-history`)
    .then(r => {
        if (!r.ok) throw new Error(`Ошибка ${r.status}`)
        return r.json()
    })
}

export function get_player_info(account_id) {
    return fetch(`/api/profile/${account_id}/info`)
    .then(r => {
        if (!r.ok) throw new Error(`Ошибка ${r.status}`)
        return r.json()
    })
}

export function get_match_metadata(matchId) {
    return fetch(`/api/profile/match/${matchId}/metadata`)
    .then(r => {
        if (!r.ok) throw new Error(`Ошибка ${r.status}`)
        return r.json()
    })
}