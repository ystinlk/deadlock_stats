import express from "express"
import axios from "axios"
const router = express.Router()

let cache = null
let cacheTime = 0

async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const r = await axios.get(url, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 1500
            })
            return r.data
        } catch (e) {
            if (i === retries - 1) throw e
            await new Promise(res => setTimeout(res, 1000))
        }
    }
}

router.get("/", async (req, res) => {
    const now = Date.now()
    if (cache && now - cacheTime < 60 * 60 * 1000) {
        return res.json(cache)
    }
    const regions = ["Europe", "Asia", "NAmerica", "SAmerica", "Oceania"]
    const data = await Promise.all(regions.map(region =>
        fetchWithRetry(`https://api.deadlock-api.com/v1/leaderboard/${region}`)
        .then(d => ({ region, entries: d.entries }))
    ))
    cache = data
    cacheTime = now
    res.json(data)
})

export default router