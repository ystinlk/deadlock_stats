const btn = document.getElementById("btn_find")
const base_URL = "https://api.deadlock-api.com"
const search_table = document.getElementById("search_table")
const input_data = document.getElementById("input_data")
function Steam_ID_find (QUERY) {
    const result = fetch(`${base_URL}/v1/players/steam-search?search_query=${QUERY}`)
    .then(r => {if (!r.ok) throw new Error(`Ошибка ${r.status}`) 
    return r.json()})
    .then(players => RenderTemplate(players))
    // ловим ошибку
    .catch(err => console.log(err.message))
}

function RenderTemplate(players) {
    search_table.innerText = ""
    let LB_row = ""
    players.forEach(player => {
        
        const row = `
            <tr>
            <td><img src="${player.avatarfull}"></td>
            <td><a href="${player.profileurl}">${player.personaname}</a></td>
            <td>матчей за 30 дней ${player.matches_played_last_30d}</td>
            </tr>
    ` 
  LB_row += row
  });
  search_table.innerHTML = LB_row
}

btn.addEventListener("click", (event) => {
    Steam_ID_find(input_data.value)
})

