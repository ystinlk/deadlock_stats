import express from "express"
const router = express.Router()

router.get("/", async (req, res) => {
    const query = req.query.search
    const data = await fetch(`https://api.deadlock-api.com/v1/players/steam-search?search_query=${query}`)
        .then(r => r.json())
    res.json(data)
})

export default router