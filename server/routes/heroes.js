import express from "express"
const router = express.Router()

router.get("/", async (req, res) => {
    const [heroes, hero_stats] =  await Promise.all ([
        fetch("https://api.deadlock-api.com/v1/assets/heroes").then(r => r.json()),
        fetch("https://api.deadlock-api.com/v1/analytics/hero-stats").then(r => r.json())
    ])
    res.json({ heroes, hero_stats})
})

export default router