import express from "express"
const router = express.Router()

router.get("/", async (req, res) => {
    const regions = ["Europe", "Asia", "NAmerica", "SAmerica", "Oceania"]
    const data = await Promise.all(regions.map(region =>
        fetch(`https://api.deadlock-api.com/v1/leaderboard/${region}`)
        .then(r => r.json())
        .then(result => ({ region, entries: result.entries }))
))

    res.json(data)
})

export default router