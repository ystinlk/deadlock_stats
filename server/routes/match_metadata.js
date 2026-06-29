import express from "express"
import axios from "axios"
const router = express.Router()


router.get("/:matchId/metadata", async (req, res) => {
    try {
        const response = await axios.get( `https://api.deadlock-api.com/v1/matches/${req.params.matchId}/metadata`)
        res.json(response.data)
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
})

export default router