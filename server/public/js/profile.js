const params = new URLSearchParams(window.location.search)
const accountId = params.get("id")

async function loadProfile() {
    const [matches, heroes, playerInfo] = await Promise.all([
        fetch(`/api/profile/${accountId}/match-history`).then(r => r.json()),
        fetch(`/api/heroes`).then(r => r.json()).then(r => r.heroes),
        fetch(`/api/profile/${accountId}/info`).then(r => r.json())
    ])

    function getHeroName(hero_id) {
        const hero = heroes.find(h => h.id === hero_id)
        return hero ? hero.name : `Герой #${hero_id}`
    }

    // общая статистика
    const total = matches.length
    const wins = matches.filter(m => m.match_result === 1).length
    const winrate = ((wins / total) * 100).toFixed(1)
    const avgKda = (matches.reduce((sum, m) => sum + (m.player_kills + m.player_assists) / Math.max(m.player_deaths, 1), 0) / total).toFixed(2)
    const avgNetworth = Math.round(matches.reduce((sum, m) => sum + m.net_worth, 0) / total)

    document.getElementById("profile-name").textContent = playerInfo.personaname || `Игрок #${accountId}`
    document.getElementById("profile-id").textContent = `Account ID: ${accountId}`
    document.getElementById("total-matches").textContent = total
    document.getElementById("winrate").textContent = winrate + "%"
    document.getElementById("avg-kda").textContent = avgKda
    document.getElementById("avg-networth").textContent = avgNetworth.toLocaleString()

    if (playerInfo.avatarfull) {
        document.getElementById("profile-avatar").src = playerInfo.avatarfull
    }

    // таблица матчей
    const tbody = document.getElementById("match-history")
    matches.forEach(m => {
        const win = m.match_result === 1
        const duration = `${Math.floor(m.match_duration_s / 60)}м ${m.match_duration_s % 60}с`
        const kda = `${m.player_kills}/${m.player_deaths}/${m.player_assists}`
        tbody.innerHTML += `
            <tr>
                <td>${getHeroName(m.hero_id)}</td>
                <td style="color: ${win ? 'green' : 'red'}">${win ? 'Победа' : 'Поражение'}</td>
                <td>${kda}</td>
                <td>${m.net_worth.toLocaleString()}</td>
                <td>${duration}</td>
            </tr>
        `
    })
}

loadProfile().catch(err => console.log(err))

window.addEventListener('scroll', () => {
    document.getElementById('scroll-top').style.opacity
        = window.scrollY > 300 ? '1' : '0'
})