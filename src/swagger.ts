export const swaggerSpec = {
    openapi: "3.0.3",
    info: {
        title: "Study RAG API",
        version: "1.0.0",
    },
    paths: {
        "/health": {
            get: {
                summary: "Health check",
                responses: { "200": { description: "OK" } },
            },
        },
        "/treinar": {
            post: {
                summary: "Envia um PDF e treina a IA com ele (incremental: acrescenta ao conhecimento existente)",
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                required: ["pdf"],
                                properties: { pdf: { type: "string", format: "binary" } },
                            },
                        },
                    },
                },
                responses: {
                    "200": { description: "Treinado com sucesso" },
                    "400": { description: "PDF ausente ou inválido" },
                    "500": { description: "Falha ao processar o PDF" },
                },
            },
        },
        "/perguntar": {
            post: {
                summary: "Faz uma pergunta sobre o manual",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["pergunta"],
                                properties: { pergunta: { type: "string", example: "o que isso faz?" } },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Resposta gerada",
                        content: {
                            "application/json": {
                                schema: { type: "object", properties: {
                                    resposta: { type: "string" },
                                    tokens: {
                                        type: "object",
                                        properties: {
                                            entrada: { type: "integer" },
                                            saida: { type: "integer" },
                                            total: { type: "integer" },
                                        },
                                    },
                                },
                            },
                            },
                        },
                    },
                    "400": { description: "Pergunta inválida" },
                },
            },
        },
    },
}
