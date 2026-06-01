import { Steam_ID_find } from "./api.js"
const btn = document.getElementById("btn_find")
const search_table = document.getElementById("search_table")
const input_data = document.getElementById("input_data")

function RenderTemplate(players) {
    search_table.innerText = ""
    let LB_row = ""
    players.forEach(player => {
        
const row = `
    <tr>
    <td><img src="${player.avatarfull}"></td>
    <td><a href="${player.profileurl}" target="_blank">${player.personaname}</a></td>
    <td>матчей за 30 дней ${player.matches_played_last_30d}</td>
    <td><a href="profile.html?id=${player.account_id}">Профиль</a></td>
    </tr>
`
  LB_row += row
  });
  search_table.innerHTML = LB_row
}

btn.addEventListener("click", (event) => {
    Steam_ID_find(input_data.value).then(players => RenderTemplate(players)).catch(err => console.log(err.message))
})

window.addEventListener('scroll', () => {
    document.getElementById('scroll-top').style.opacity
        = window.scrollY > 300 ? '1' : '0'
})