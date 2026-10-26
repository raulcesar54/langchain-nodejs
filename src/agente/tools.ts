import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { getContext } from "../client/config"

export const buscarDocumentos = tool(
    async ({ consulta }) => {
        const contexto = await getContext(consulta)
        return contexto || "Nenhum trecho encontrado nos documentos."
    },
    {
        name: "buscar_documentos",
        description:
            "Busca trechos relevantes nos PDFs indexados. " +
            "Use para qualquer pergunta sobre o conteúdo dos documentos enviados.",
        schema: z.object({
            consulta: z.string().describe("Texto a ser buscado nos documentos"),
        }),
    }
)

function calcular(expressao: string): number {
    const tokens = expressao.replace(/\s+/g, "").match(/\d+(\.\d+)?|[+\-*/^%()]/g) ?? []
    if (tokens.join("") !== expressao.replace(/\s+/g, "")) {
        throw new Error("Expressão contém caracteres inválidos")
    }
    let pos = 0
    const proximo = () => tokens[pos]

    const fator = (): number => {
        const t = tokens[pos++]
        if (t === "-") return -fator()
        if (t === "+") return fator()
        if (t === "(") {
            const valor = soma()
            if (tokens[pos++] !== ")") throw new Error("Parêntese não fechado")
            return valor
        }
        const n = Number(t)
        if (t === undefined || Number.isNaN(n)) throw new Error("Expressão inválida")
        return n
    }
    const potencia = (): number => {
        const base = fator()
        if (proximo() === "^") { pos++; return base ** potencia() }
        return base
    }
    const produto = (): number => {
        let valor = potencia()
        while (["*", "/", "%"].includes(proximo())) {
            const op = tokens[pos++]
            const dir = potencia()
            valor = op === "*" ? valor * dir : op === "/" ? valor / dir : valor % dir
        }
        return valor
    }
    const soma = (): number => {
        let valor = produto()
        while (["+", "-"].includes(proximo())) {
            const op = tokens[pos++]
            const dir = produto()
            valor = op === "+" ? valor + dir : valor - dir
        }
        return valor
    }

    const resultado = soma()
    if (pos !== tokens.length) throw new Error("Expressão inválida")
    return resultado
}

export const calculadora = tool(
    async ({ expressao }) => {
        try {
            return String(calcular(expressao))
        } catch (err) {
            return `Erro: ${err instanceof Error ? err.message : "falha ao calcular"}`
        }
    },
    {
        name: "calculadora",
        description: "Calcula expressões aritméticas. Suporta + - * / ^ % e parênteses. Ex.: (17 * 23) + 4",
        schema: z.object({
            expressao: z.string().describe("Expressão aritmética a calcular"),
        }),
    }
)

export const dataHoraAtual = tool(
    async () => {
        const agora = new Date()
        return JSON.stringify({
            iso: agora.toISOString(),
            local: agora.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
            diaDaSemana: agora.toLocaleDateString("pt-BR", { weekday: "long", timeZone: "America/Sao_Paulo" }),
        })
    },
    {
        name: "data_hora_atual",
        description: "Retorna a data e a hora atuais (fuso de São Paulo).",
        schema: z.object({}),
    }
)

export const tools = [buscarDocumentos, calculadora, dataHoraAtual]
