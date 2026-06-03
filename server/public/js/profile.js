import { get_player_matches, get_player_info, get_heroes, get_match_metadata } from "./api.js"

const params = new URLSearchParams(window.location.search)
const accountId = params.get("id")
const tbody = document.getElementById("match-history")

function getHeroName(heroes, hero_id) {
    const hero = heroes.find(h => h.id === hero_id)
    return hero ? hero.name : `Герой #${hero_id}`
}

function renderStats(matches) {
    const total = matches.length
    const wins = matches.filter(m => m.match_result === 1).length
    const winrate = ((wins / total) * 100).toFixed(1)
    const avgKda = (matches.reduce((sum, m) => sum + (m.player_kills + m.player_assists) / Math.max(m.player_deaths, 1), 0) / total).toFixed(2)
    const avgNetworth = Math.round(matches.reduce((sum, m) => sum + m.net_worth, 0) / total)

    document.getElementById("total-matches").textContent = total
    document.getElementById("winrate").textContent = winrate + "%"
    document.getElementById("avg-kda").textContent = avgKda
    document.getElementById("avg-networth").textContent = avgNetworth.toLocaleString()
}

function renderMatches(matches, heroes) {
    tbody.innerHTML = ""
    matches.slice(0, 10).forEach(m => {
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

    if (matches.length > 10) {
        const btn = document.createElement("button")
        btn.textContent = "Все матчи"
        btn.className = "more-btn"
        btn.onclick = () => {
            window.location.href = `matches.html?id=${accountId}`
        }
        document.querySelector("table").after(btn)
    }
}

function renderPlayerInfo(playerInfo) {
    document.getElementById("profile-name").textContent = playerInfo.personaname || `Игрок #${accountId}`
    document.getElementById("profile-id").textContent = `Account ID: ${accountId}`
    if (playerInfo.avatarfull) {
        document.getElementById("profile-avatar").src = playerInfo.avatarfull
    }
}

async function renderTeammates(teammates) {
    const tbody = document.getElementById("teammates-body")
    const table = document.getElementById("teammates-table")
    const loading = document.getElementById("teammates-loading")

    tbody.innerHTML = ""
    const sorted = Object.entries(teammates)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 10)

    await Promise.all(sorted.map(async ([id, data]) => {
        const wr = ((data.wins / data.total) * 100).toFixed(1)
        let name = id
        try {
            const info = await get_player_info(id)
            if (info.personaname) name = info.personaname
        } catch (e) {}

        const row = document.createElement("tr")
        row.innerHTML = `
            <td><a href="profile.html?id=${id}">${name}</a></td>
            <td>${data.total}</td>
            <td style="color: ${wr >= 50 ? 'green' : 'red'}">${wr}%</td>
        `
        tbody.appendChild(row)
    }))

    table.style.display = ""
}
async function loadTeammates(matches) {
    const teammates = {}
    const loading = document.getElementById("teammates-loading")
    const BATCH_SIZE = 10

    for (let i = 0; i < matches.length; i += BATCH_SIZE) {
        const batch = matches.slice(i, i + BATCH_SIZE)
        loading.textContent = `Загрузка тиммейтов... ${Math.min(i + BATCH_SIZE, matches.length)}/${matches.length}`

        await Promise.all(batch.map(async match => {
            try {
                const data = await get_match_metadata(match.match_id)
                const players = data.match_info.players
                const myTeam = players.find(p => p.account_id == accountId)?.team

                players.forEach(p => {
                    if (p.account_id == accountId) return
                    if (!p.account_id || p.account_id == 0) return
                    if (p.team !== myTeam) return

                    if (!teammates[p.account_id]) {
                        teammates[p.account_id] = { total: 0, wins: 0 }
                    }
                    teammates[p.account_id].total++
                    if (match.match_result === 1) teammates[p.account_id].wins++
                })
            } catch (e) {
                console.log(`Ошибка матча ${match.match_id}:`, e.message)
            }
        }))
    }

    await renderTeammates(teammates)
}

Promise.all([
    get_player_matches(accountId),
    get_heroes(),
    get_player_info(accountId)
]).then(([matches, heroes, playerInfo]) => {
    renderPlayerInfo(playerInfo)
    renderStats(matches)
    renderMatches(matches, heroes)
    loadTeammates(matches)
})
.catch(err => console.log(err.message))

window.addEventListener('scroll', () => {
    document.getElementById('scroll-top').style.opacity
        = window.scrollY > 300 ? '1' : '0'
})