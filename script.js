
const assetsUrl = "https://assets.deadlock-api.com/v2/heroes"
const statsUrl = "https://api.deadlock-api.com/v1/analytics/hero-stats"
const table = document.getElementById("heroes-table")

Promise.all([
  fetch(assetsUrl).then(r => r.json()),
  fetch(statsUrl).then(r => r.json())
]).then(([heroes, stats]) => {
  console.log("Герои:", heroes)
  console.log("Статы:", stats)
  const allmatches = stats.reduce((summ, item) => summ + item.matches, 0); // общее колво матчей в этом патче
  let data_Sorted = []

  function SortBy(choose) {
    // получаем данные для сортировки
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
    if (choose === 1) {
      data_Sorted = [...data_unSorted].sort((a, b) => a.name.localeCompare(b.name))
    }
    if (choose === 2) {
      data_Sorted = [...data_unSorted].sort((a, b) => b.win_rate - a.win_rate)
    }
    if (choose === 3) {
      data_Sorted = [...data_unSorted].sort((a, b) => b.pick_rate - a.pick_rate)
    }
  }


  function TableRender(choose) {
    table.innerHTML = ""
    SortBy(choose)
    data_Sorted.forEach(hero => {


      // добавляем html строчки в таблицу
      const row = `
          <tr>
            <td>${hero.name}</td>
            <td>${hero.win_rate}%</td>
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