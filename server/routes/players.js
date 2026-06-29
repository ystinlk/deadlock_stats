import express from "express"
import fetchWithRetry from "../utils/RetryFetch.js"
const router = express.Router()

router.get("/", async (req, res) => { 
    try {
    const query = encodeURIComponent(req.query.search)
    const data = await fetchWithRetry(
        `https://api.deadlock-api.com/v1/players/steam-search?search_query=${query}`
    )
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