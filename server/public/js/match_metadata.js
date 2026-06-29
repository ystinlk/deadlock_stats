import { get_match_metadata, get_player_info, get_items } from "./api.js"
const Match_Table = document.getElementById('Match_Data_Table')
const input = document.getElementById('match_input')
const btn = document.getElementById('match_btn')
const params = new URLSearchParams(window.location.search)
const matchId = params.get('id')
const box1 = document.getElementById('box1')
const box2 = document.getElementById('box2')
const box_mid = document.getElementById('box_mid')

btn.addEventListener('click', () => {
    window.location.href = `../pages/match_metadata.html?id=${input.value}`
})

// загружаем данные и пихаем их в переменные
async function load_data() {
const alldata = await get_match_metadata(matchId)
const allplayers= alldata.match_info.players
const team0 = allplayers.filter(p => p.team === 0).sort((a, b) => a.player_slot - b.player_slot)
const team1 = allplayers.filter(p => p.team === 1).sort((a, b) => a.player_slot - b.player_slot)

const all_items = await get_items()
const itemsMap = {}
all_items.forEach(item => {
    itemsMap[item.id] = item
})

const minutes = Math.floor(alldata.match_info.duration_s / 60)
const seconds = alldata.match_info.duration_s % 60

const team0Withname = await Promise.all(
    team0.map(async player => {
        const info = await get_player_info(player.account_id)
        return { ...player, username: info.personaname }
    })  
)
const team1Withname = await Promise.all(
    team1.map(async player => {
        const info = await get_player_info(player.account_id)
        return { ...player, username: info.personaname }
    })  
)
const total_kills_team0 = team0.reduce(function(sum, currentPlayer) {
    return sum + currentPlayer.kills}, 0)
const total_kills_team1 = team1.reduce(function(sum, currentPlayer) {
    return sum + currentPlayer.kills}, 0)
const total_networth_team0 = team0.reduce(function(sum, currentPlayer) {
    return sum + currentPlayer.net_worth}, 0)
const total_networth_team1 = team1.reduce(function(sum, currentPlayer) {
    return sum + currentPlayer.net_worth}, 0)
const total_dmg_team0 = team0.reduce(function(sum, currentPlayer) {
    return sum + currentPlayer.stats[currentPlayer.stats.length - 1].player_damage}, 0)
const total_dmg_team1 = team1.reduce(function(sum, currentPlayer) {
    return sum + currentPlayer.stats[currentPlayer.stats.length - 1].player_damage}, 0)

// сразу заполняем боковое меню его рендерить не нужно
box1.innerHTML = `Команда 1 <br>Убийств ${total_kills_team0}<br>Нетворс ${total_networth_team0}<br>Урон ${total_dmg_team0}`
box2.innerHTML = `Команда 2 <br>Убийств ${total_kills_team1}<br>Нетворс ${total_networth_team1}<br>Урон ${total_dmg_team1}`
box_mid.innerHTML = `Длительность ${minutes}:${seconds}`
const teams = [team0Withname,team1Withname]
TableRender(teams, itemsMap)
}
load_data()
function TableRender(teams, itemsMap) {
let Match_rows = ``

// рисуем команды
teams.forEach((team, counter) => {
Match_rows += `<tr>Команда ${counter + 1}<tr>`
team.forEach(player => {

    const itemIds = [...new Set(
    player.items
        .filter(i => i.sold_time_s === 0)
        .map(i => i.item_id)
)]
    const itemsURLS = itemIds.map(itemID =>  itemsMap[itemID]?.shop_image )
    const itemsHTML = itemsURLS
    .filter(url => url)
    .map(url => `<img src="${url}">`).join('')
const row = `
    <tr>
        <td>${player.username} </td>
        <td>${player.kills}/${player.deaths}/${player.assists}</td>
        <td>${player.net_worth}</td>
        <td>${player.stats[player.stats.length - 1].player_damage}</td>
        <td>${itemsHTML}</td>
    </tr>
    `
    Match_rows += row
    })

})
Match_Table.innerHTML = Match_rows
} 
