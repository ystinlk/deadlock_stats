import express from "express"
import axios from "axios"
const router = express.Router()

async function fetchWithRetry(url, retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            const r = await axios.get(url, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 10000
            })
            return r.data
        } catch (e) {
            if (i === retries - 1) throw e
            await new Promise(res => setTimeout(res, 1000))
        }
    }
}

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

router.get("/match/:matchId/metadata", async (req, res) => {
    try {
        const data = await fetchWithRetry(
            `https://api.deadlock-api.com/v1/matches/${req.params.matchId}/metadata`
        )
        res.json(data)
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
})

export default router