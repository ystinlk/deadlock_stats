import { get_heroes, get_stats } from "./api.js"

const table = document.getElementById("heroes-table")

function getIconUrl(hero) {
  if (hero.images) {
    return hero.images.icon_image_webp || hero.images.icon_image_png || hero.images.minimap_image || null
  }  
  return hero.icon_image_webp || hero.minimap_image || null
}
  // api запросы
Promise.all([get_heroes(),get_stats()])
  .then(([heroes, stats]) => {
  const allmatches = stats.reduce((summ, item) => summ + item.matches, 0); // общее колво матчей в этом патче
  const data_unSorted = [] 
  let data_Sorted = []
  let currentSort = {column: 2, direction: "desc"} // текущая сортировка  

  // Получаем данные с апи ключей и пихаем их в отдеьную переменную без мусора 
  function get_raw_data() {          
    heroes.forEach(hero => {
      const heroStats = stats.find(stat => stat.hero_id === hero.id)
      if (!heroStats) return

      //    Винрейт пикрей тут считаем
      const winrate = (heroStats.wins / heroStats.matches * 100).toFixed(1)

      const PickRate = (heroStats.matches / allmatches * 100).toFixed(1)

      // записываем данные для сортировки
      data_unSorted.push({
        name: hero.name,
        icon: getIconUrl(hero),
        initial: hero.name[0] || "?",
        win_rate: Number(winrate),
        pick_rate: Number(PickRate)
      })
    }); 
  }

  function SortBy(column) {
    if (currentSort.column === column) {
      currentSort.direction = currentSort.direction === "desc" ? "asc" : "desc"
    } else {
      currentSort.column = column
      currentSort.direction = "desc"
    }
    // Сортировка в зависимости от выбора
    const dir = currentSort.direction === "desc" ? 1 : -1
    if (column === 1) {
      data_Sorted = [...data_unSorted].sort((a, b) => dir * b.name.localeCompare(a.name))
    }
    if (column === 2) {
      data_Sorted = [...data_unSorted].sort((a, b) => dir * (b.win_rate - a.win_rate))
    }
    if (column === 3) {
      data_Sorted = [...data_unSorted].sort((a, b) => dir * (b.pick_rate - a.pick_rate))
    } 
  }

  function UpdateArrows() {
    document.getElementById("hero"). textContent = "Hero"
    document.getElementById("WR"). textContent = "WR"
    document.getElementById("PR"). textContent = "PR"
    
    const arrow = currentSort.direction ==="desc" ? "↓" : "↑"
    const buttons = {1: "hero", 2: "WR", 3: "PR"}
    const activeBtn = document.getElementById(buttons[currentSort.column])
    activeBtn.textContent += arrow
  }

  function TableRender(column) {
    let LB_row = ""
    SortBy(column)
    UpdateArrows ()
    data_Sorted.forEach(hero => { 
    const wrColor = hero.win_rate >= 50 ? "green" : "red"
const iconHtml = hero.icon
  ? `<img src="${hero.icon}" class="hero-icon">`
  : `<span class="hero-initial">${hero.initial}</span>`

const row = `
  <tr>
  <td>${iconHtml}${hero.name}</td>
  <td style="color: ${wrColor}">${hero.win_rate}%</td>
  <td>${hero.pick_rate}%</td>
  </tr>
`
      LB_row += row
    })
    table.innerHTML = LB_row
  }
  // рендер после загрузки страницы
  get_raw_data()
  TableRender(2)
  document.getElementById("hero").addEventListener("click", () => TableRender(1))
  document.getElementById("WR").addEventListener("click", () => TableRender(2))
  document.getElementById("PR").addEventListener("click", () => TableRender(3))
}).catch(err => console.log(err.message))