import {get_leaderboard} from "./api.js";
const regions = [
  "Europe",
  "Asia",
  "NAmerica",
  "SAmerica",
  "Oceania"
];

const div = document.getElementsByTagName("div")[0]
const leaderboards = []
const lb_table = document.getElementById("leaderboard_table")

function RenderTemplate(id) {
  let LB_row = ""
  lb_table.innerText = ""
  const result = leaderboards.find(lb => lb.region === id)
  if (!result) return;
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

Promise.all(get_leaderboard()).then(data => {
  regions.map((region_x, index) =>
    leaderboards.push({
      region: region_x,
      data: data[index].entries
    })
  )

  RenderTemplate("Europe")

  document.querySelectorAll('.region-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
    })
})
})
// ловим ошибку
.catch(err => console.log(err.message))

window.addEventListener('scroll', () => {
    document.getElementById('scroll-top').style.opacity
        = window.scrollY > 300 ? '1' : '0'
})
