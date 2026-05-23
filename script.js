
const assetsUrl = "https://assets.deadlock-api.com/v2/heroes"
const statsUrl = "https://api.deadlock-api.com/v1/analytics/hero-stats"
const table = document.getElementById("heroes-table")

Promise.all([
  fetch(assetsUrl).then(r => r.json()),
  fetch(statsUrl).then(r => r.json())
]).then(([heroes, stats]) => {
  const allmatches = stats.reduce((summ, item) => summ + item.matches, 0); // общее колво матчей в этом патче
  let data_Sorted = []
  let currentSort = {column: 2, direction: "desc"} // текущая сортировка 

  function SortBy(column) {
    if (currentSort.column === column) {
      currentSort.direction = currentSort.direction === "desc" ? "asc" : "desc"
    } else {
      currentSort.column = column
      currentSort.direction = "desc"
    }
    const data_unSorted = []
    heroes.forEach(hero => {

      const heroStats = stats.find(stat => stat.hero_id === hero.id)
      if (!heroStats) return

      const winrate = (
        heroStats.wins / heroStats.matches * 100
      ).toFixed(1)

      const PickRate = (heroStats.matches / allmatches * 100).toFixed(1)
      // записываем данные для сортировки
      data_unSorted.push({
        name: hero.name,
        win_rate: Number(winrate),
        pick_rate: Number(PickRate)
      })
    });
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
    table.innerHTML = ""
    SortBy(column)
    UpdateArrows ()
    data_Sorted.forEach(hero => { 
    const wrColor = hero.win_rate >= 50 ? "green" : "red"


      // добавляем html строчки в таблицу
      const row = `
          <tr>
          <td>${hero.name}</td>
          <td style="color: ${wrColor}">${hero.win_rate}%</td>
          <td>${hero.pick_rate}%</td>
          </tr>
        `

      table.innerHTML += row

    })
  }

  TableRender(2)
  document.getElementById("hero").addEventListener("click", () => TableRender(1))
  document.getElementById("WR").addEventListener("click", () => TableRender(2))
  document.getElementById("PR").addEventListener("click", () => TableRender(3))

})