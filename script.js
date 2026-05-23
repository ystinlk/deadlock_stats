
const assetsUrl = "https://assets.deadlock-api.com/v2/heroes"
const statsUrl = "https://api.deadlock-api.com/v1/analytics/hero-stats"

Promise.all([
    fetch(assetsUrl).then(r => r.json()),
    fetch(statsUrl).then(r => r.json()) 
  ]).then(([heroes, stats]) => {
    console.log("Герои:", heroes)
    console.log("Статы:", stats)
  })

