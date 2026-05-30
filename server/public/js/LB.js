import {get_leaderboard} from "./api.js";

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

get_leaderboard().then(data => {
  
    leaderboards.push(...data.map(item => ({ 
      region: item.region, 
      data: item.entries 
    })
  )
)

  RenderTemplate("Europe")

  document.querySelectorAll('.region-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      RenderTemplate(btn.id)
    })
  })
})
.catch(err => console.log(err.message))

window.addEventListener('scroll', () => {
  document.getElementById('scroll-top').style.opacity
    = window.scrollY > 300 ? '1' : '0'
})