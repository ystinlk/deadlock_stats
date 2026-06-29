import express from "express"
import fetchWithRetry from "../utils/RetryFetch.js"
const router = express.Router()

let cache = null
let cacheTime = 0

router.get("/", async (req, res) => {
    try {
    const now = Date.now()
    if (cache && now - cacheTime < 60 * 60 * 1000) {
        return res.json(cache)
    }
    const regions = ["Europe", "Asia", "NAmerica", "SAmerica", "Oceania"]
    const data = await  Promise.all(regions.map(region =>
        fetchWithRetry(`https://api.deadlock-api.com/v1/leaderboard/${region}`)
        .then(d => ({ region, entries: d.entries }))
    ))
    cache = data
    cacheTime = now
    res.json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
})

export default router