import "dotenv/config"
import express from "express"
import cors from "cors"
import multer from "multer"
import swaggerUi from "swagger-ui-express"
import { perguntar } from "./rag"
import { swaggerSpec } from "./swagger"
import { treinar } from "./treinar"

const app = express()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })
const PORT = Number(process.env.PORT) || 3000

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }))
app.use(express.json())

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/health", (_req, res) => {
    res.json({ status: "ok" })
})

app.post("/perguntar", async (req, res) => {
    const pergunta = req.body?.pergunta
    if (typeof pergunta !== "string" || !pergunta.trim()) {
        return res.status(400).json({ error: "O campo 'pergunta' é obrigatório" })
    }
    const resultado = await perguntar(pergunta)
    res.json(resultado)
})

app.post("/treinar", upload.single("pdf"), async (req, res) => {
    const file = req.file
    if (!file) {
        return res.status(400).json({ error: "Envie um PDF no campo 'pdf' (multipart/form-data)" })
    }
    if (file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "O arquivo deve ser um PDF" })
    }
    try {
        const { novos, ignorados } = await treinar(file.buffer)
        res.json({ status: "treinado", arquivo: file.originalname, novos, ignorados })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err instanceof Error ? err.message : "Falha ao treinar" })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT} (docs em /docs)`)
})
