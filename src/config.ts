import 'dotenv/config'
import { ChatOllama } from "@langchain/ollama";

export const llama = new ChatOllama({
    model: "deepseek-r1:7b",
    temperature: 0,
    think: false,
})
