const div = document.getElementsByTagName("div")[0]
const regions = [
  "Europe",
  "Asia",
  "NAmerica",
  "SAmerica",
  "Oceania"
]
const leaderboards = []
const lb_table = document.getElementById("leaderboard_table")
function RenderTemplate(id) {
  let LB_row = ""
  lb_table.innerText = ""
  const result = leaderboards.find(leaderboards => leaderboards.region === id)
  result.data.forEach(player => {
    const row = `
      <tr>
      <td>${player.rank}</td>
      <td>${player.account_name}</td>
      </tr>
  `
  LB_row += row
  });
lb_table.innerHTML = LB_row
}

div.addEventListener("click", (event) => {
  RenderTemplate(event.target.id)
})

Promise.all(
  regions.map(region =>
    fetch(`https://api.deadlock-api.com/v1/leaderboard/${region}`)
      .then(r => r.json())
  )
).then(data => {
  regions.map((region_x, index) =>
    leaderboards.push({
      region: region_x,
      data: data[index].entries
    })
  )
  console.log(leaderboards)
  RenderTemplate("Europe")
})

