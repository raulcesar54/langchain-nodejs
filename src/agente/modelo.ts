import "dotenv/config"
import { ChatAnthropic } from "@langchain/anthropic"
import { ChatOllama } from "@langchain/ollama"

const usarAnthropic = Boolean(process.env.ANTHROPIC_API_KEY?.trim())

export const provedor = usarAnthropic ? "anthropic" : "ollama"

export const modelo = usarAnthropic
    ? new ChatAnthropic({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5",
        temperature: 0,
    })
    : new ChatOllama({
        model: process.env.OLLAMA_MODEL || "qwen3",
        temperature: 0,
        think: false,
    })
