import { createHash } from "node:crypto"
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers"
import { Chroma } from "@langchain/community/vectorstores/chroma"
import { PDF } from "./pdf"

const COLLECTION_NAME = "manual"
const CHROMA_CLIENT = { path: undefined, host: "localhost", port: 8000, ssl: false } as any

const embedding = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
    pretrainedOptions: { dtype: "fp32" } as any
})

const idDoChunk = (texto: string) => createHash("sha256").update(texto).digest("hex")

export async function treinar(buffer: Buffer) {
    const pdf = new PDF(buffer)
    await pdf.load()
    const chunks = await pdf.split()
    if (!chunks || chunks.length === 0) {
        throw new Error("Não foi possível extrair texto do PDF")
    }

    const porId = new Map(chunks.map(c => [idDoChunk(c.pageContent), c]))
    const ids = [...porId.keys()]

    const store = new Chroma(embedding, {
        collectionName: COLLECTION_NAME,
        clientParams: CHROMA_CLIENT,
    })
    const collection = await store.ensureCollection()

    const existentes = new Set((await collection.get({ ids, include: [] })).ids)
    const novosIds = ids.filter(id => !existentes.has(id))

    if (novosIds.length > 0) {
        await store.addDocuments(novosIds.map(id => porId.get(id)!), { ids: novosIds })
    }

    return { novos: novosIds.length, ignorados: ids.length - novosIds.length }
}
