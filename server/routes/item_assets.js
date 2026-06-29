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
    const data = await fetchWithRetry(`https://api.deadlock-api.com/v1/assets/items`)
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