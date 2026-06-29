import dns from "node:dns"

dns.setDefaultResultOrder("ipv4first")

import match_router from "./routes/match_metadata.js"
import express from "express"
import heroes_router from "./routes/heroes.js"
import leader_router from "./routes/leaderboard.js"
import Steam_ID_find from "./routes/players.js"
import profile_router from "./routes/profiles.js"
import item_assets_router from "./routes/item_assets.js"

const app = express()
const PORT = 3000

app.use("/api/items", item_assets_router)
app.use("/api/matches", match_router)
app.use("/api/heroes", heroes_router)
app.use("/api/leaderboard", leader_router)
app.use("/api/players", Steam_ID_find)
app.use("/api/profile", profile_router)


app.use(express.static("public"))

app.listen(PORT, () => console.log(`сервер запущен \n http://localhost:${PORT} \n ильшат фембой`))