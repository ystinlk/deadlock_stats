import express from "express"
import fetchWithRetry from "../utils/RetryFetch.js"
const router = express.Router()

router.get("/:id/match-history", async (req, res) => {
    try {
        const data = await fetchWithRetry(
            `https://api.deadlock-api.com/v1/players/${req.params.id}/match-history`
        )
        res.json(data)
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
})

router.get("/:id/info", async (req, res) => {
    try {
        const data = await fetchWithRetry(
            `https://api.deadlock-api.com/v1/players/steam-search?search_query=${req.params.id}`
        )
        const player = data.find(p => p.account_id == req.params.id)
        res.json(player || {})
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
})

export default router