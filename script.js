
const assetsUrl = "https://assets.deadlock-api.com/v2/heroes"
const statsUrl = "https://api.deadlock-api.com/v1/analytics/hero-stats"
const table = document.getElementById("heroes-table")

Promise.all([
    fetch(assetsUrl).then(r => r.json()),
    fetch(statsUrl).then(r => r.json()) 
  ]).then(([heroes, stats]) => {
    console.log("Герои:", heroes)
    console.log("Статы:", stats)
    
    const allmatches = stats.reduce((summ, item) => summ + item.matches, 0);

    heroes.forEach(hero => {

    const heroStats = stats.find(stat => stat.hero_id === hero.id)
    if (!heroStats) return

    const winrate = (
      heroStats.wins / heroStats.matches * 100
    ).toFixed(1)



    const PickRate = (heroStats.matches / allmatches * 100).toFixed(1)

    const row = `
      <tr>
        <td>${hero.name}</td>
        <td>${winrate}%</td>
        <td>${PickRate}%</td>
      </tr>
    `

    table.innerHTML += row

  })
})