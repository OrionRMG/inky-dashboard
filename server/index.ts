import express from "express"
import cors from "cors"
import fs from "fs"
import chokidar from "chokidar"
import path from "path"
import { debouncedCapture } from "./capture-display"
const port = 3000

const app = express()
app.use(cors())
app.use(express.json())

const DATA_FILE = path.join(__dirname, "../data/items.json")

type Item = {
    owner: "orion" | "maddie"
    body: string
}

type Items = {
    items: Item[]
}

function readJSONFromFile(filePath: string): Items {
    const data = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, "utf-8")
        : '{"items":[]}'
    const json = JSON.parse(data)
    return json
}

function writeJSONToFile(filePath: string, data: string) {
    fs.writeFileSync(filePath, data)
}

app.use(express.static(path.join(__dirname, "../client/dist")))

app.get("/api/items", (_req, res) => {
    const data = readJSONFromFile(DATA_FILE)
    res.json(data)
})

app.put("/api/items", (req, res) => {
    const json = JSON.stringify({ items: req.body.items })
    writeJSONToFile(DATA_FILE, json)
    res.json({ success: true })
})

app.get('*splat', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, "0.0.0.0", () => {
    console.log("Server running on port " + port)
})

chokidar
    .watch(DATA_FILE, {
        persistent: true,
        ignoreInitial: true, // don't trigger on startup
    })
    .on("change", () => debouncedCapture())
