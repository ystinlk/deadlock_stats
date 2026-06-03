import express from "express"
import axios from "axios"
const router = express.Router()

async function fetchWithRetry(url, retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            const r = await axios.get(url, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 1000
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