import axios from "axios"

export default async function fetchWithRetry(url, retries = 4) {
    for (let i = 0; i < retries; i++) {
        try {
            const r = await axios.get(url, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 3000
            })
            return r.data
        } catch (e) {
            if (i === retries - 1) throw e
            await new Promise(res => setTimeout(res, 1000))
        }
    }
}