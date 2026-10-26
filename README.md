# Study

API de RAG (Retrieval-Augmented Generation) em TypeScript. Faz upload de PDFs, gera embeddings, armazena no ChromaDB e responde perguntas com base no conteúdo.

## Stack

- Node.js + Express 5 + TypeScript
- LangChain (Anthropic, Ollama, Community)
- ChromaDB (banco vetorial)
- Embeddings via `@huggingface/transformers`
- Swagger UI para documentação

## Pré-requisitos

- Node.js 18+
- Docker (para o ChromaDB)
- [Ollama](https://ollama.com) com o modelo `deepseek-r1:7b` (`ollama pull deepseek-r1:7b`)
- Chave da API da Anthropic (opcional, conforme o modelo usado)

## Configuração

```bash
npm install
cp .env.example .env   # preencha as variáveis
```

| Variável            | Descrição                                |
| ------------------- | ---------------------------------------- |
| `ANTHROPIC_API_KEY` | Chave da API da Anthropic                |
| `CHROMA_DB_URL`     | URL do ChromaDB (ex.: `http://localhost:8000`) |

## Executando

Suba o ChromaDB:

```bash
docker build -t study-chroma .
docker run -p 8000:8000 study-chroma
```

Inicie a API:

```bash
npm run dev     # desenvolvimento (hot reload)
npm run build && npm start   # produção
```

## Endpoints

| Método | Rota                | Descrição                                  |
| ------ | ------------------- | ------------------------------------------ |
| GET    | `/health`           | Verifica se a API está no ar               |
| POST   | `/treinar`          | Upload de PDF (campo `pdf`) e indexação    |
| POST   | `/perguntar`        | Faz uma pergunta e recebe a resposta       |
| GET    | `/docs`             | Documentação Swagger                       |

## Estrutura

```
src/
├── index.ts    # servidor Express e rotas
├── config.ts   # configuração do modelo LLM
├── rag.ts      # lógica de recuperação e resposta
├── treinar.ts  # indexação de PDFs no ChromaDB
├── pdf.ts      # leitura de PDFs
└── swagger.ts  # especificação OpenAPI
```

## Sobre o projeto

Projeto rápido feito para estudo, sem uso de IA para escrever o código.

## Referências

- [ChromaDB Docs](https://docs.trychroma.com)
- [LangChain Docs](https://js.langchain.com/docs)
- [Ollama](https://ollama.com)
- [Building a Production-Ready RAG System with Node.js, LangChain, Ollama and ChromaDB](https://medium.com/simform-engineering/building-a-production-ready-rag-system-with-node-js-langchain-ollama-and-chromadb-8fefefede6be)
- [LangChain Basics with Node.js - Part 1](https://medium.com/@bharathy.poovalingam/langchain-basics-with-nodejs-part-1-a0163e463c18)
