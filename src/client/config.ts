import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import 'dotenv'
import { Document } from "langchain";

const CHROMA_CLIENT = { path: undefined, host: "localhost", port: 8000, ssl: false } as any


const embedding = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
    pretrainedOptions: { dtype: "fp32" } as any
})


export const createDoc = async (spliiter: Document<Record<string, any>>[]) => {
    return Chroma.fromDocuments(spliiter, embedding, {
        collectionName: "manual",
        clientParams: CHROMA_CLIENT,
    })
}

export const existCollection = async () => {
    return Chroma.fromExistingCollection(embedding, {
        collectionName: "manual",
        clientParams: CHROMA_CLIENT,
    })
}

export const getContext = async (pergunta: string) => {
    const store = await existCollection()
    const results = await store.similaritySearch(pergunta, 4)
    return results.map(d => d.pageContent).join("\n\n---\n\n")
}