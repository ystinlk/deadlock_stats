import { get_player_matches, get_heroes } from "./api.js"

const params = new URLSearchParams(window.location.search)
const accountId = params.get("id")
const tbody = document.getElementById("match-history")

document.getElementById("back-to-profile").href = `profile.html?id=${accountId}`

function getHeroName(heroes, hero_id) {
    const hero = heroes.find(h => h.id === hero_id)
    return hero ? hero.name : `Герой #${hero_id}`
}

Promise.all([
    get_player_matches(accountId),
    get_heroes()
]).then(([matches, heroes]) => {
    matches.forEach(m => {
        const win = m.match_result === 1
        const duration = `${Math.floor(m.match_duration_s / 60)}м ${m.match_duration_s % 60}с`
        const kda = `${m.player_kills}/${m.player_deaths}/${m.player_assists}`
        tbody.innerHTML += `
            <tr>
                <td>${getHeroName(heroes, m.hero_id)}</td>
                <td style="color: ${win ? 'green' : 'red'}">${win ? 'Победа' : 'Поражение'}</td>
                <td>${kda}</td>
                <td>${m.net_worth.toLocaleString()}</td>
                <td>${duration}</td>
            </tr>
        `
    })
})
.catch(err => console.log(err.message))

window.addEventListener('scroll', () => {
    document.getElementById('scroll-top').style.opacity
        = window.scrollY > 300 ? '1' : '0'
})