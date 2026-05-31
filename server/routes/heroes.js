import express from "express"
import axios from "axios"
const router = express.Router()

async function fetchWithRetry(url, retries = 5) {
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
    try {
    const [heroes, hero_stats] =  await Promise.all([
        fetchWithRetry("https://api.deadlock-api.com/v1/assets/heroes"),
        fetchWithRetry("https://api.deadlock-api.com/v1/analytics/hero-stats")
    ])
    res.json({ 
        heroes, 
        hero_stats
    })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
})

export default router