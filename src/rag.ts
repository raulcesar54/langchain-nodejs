import { modelo } from "./config"
import { getContext } from "./client/config"

function montarMensagens(pergunta: string, contexto: string) {
    return [
        ["system",
            "Responda usando APENAS o contexto abaixo. " +
            "Se a resposta não estiver no contexto, diga que não sabe.\n\n" +
            `Contexto:\n${contexto}`],
        ["human", pergunta],
    ] as [string, string][]
}

export async function perguntar(pergunta: string) {
    const contexto = await getContext(pergunta)
    const resposta = await modelo.invoke(montarMensagens(pergunta, contexto))

    const usage = resposta.usage_metadata
    const tokens = {
        entrada: usage?.input_tokens ?? 0,
        saida: usage?.output_tokens ?? 0,
        total: usage?.total_tokens ?? 0,
    }

    return { resposta: resposta.content, tokens }
}
