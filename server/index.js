import dns from "node:dns"

dns.setDefaultResultOrder("ipv4first")

import express from "express"
import heroes_router from "./routes/heroes.js"
import leader_router from "./routes/leaderboard.js"
import Steam_ID_find from "./routes/players.js"


const app = express()
const PORT = 3000

app.use("/api/heroes", heroes_router)
app.use("/api/leaderboard", leader_router)
app.use("/api/players", Steam_ID_find)


app.use(express.static("public"))

app.listen(PORT, () => console.log(`сервер запущен на порту ${PORT}`))