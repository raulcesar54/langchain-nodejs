import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { PDFParse } from 'pdf-parse'

const DEFAULT_CHUNK_SIZE = 1000
const DEFAULT_CHUNK_OVERLAP = 200

export class PDF {
    constructor(private buffer: Buffer) { }
    text: string | null = null

    async load() {
        const pdf = new PDFParse({ data: this.buffer })
        const result = await pdf.getText()
        this.text = result.text
        return this.text
    }

    split() {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: DEFAULT_CHUNK_SIZE,
            chunkOverlap: DEFAULT_CHUNK_OVERLAP
        })
        if (this.text === null) return null
        return splitter.createDocuments([this.text])
    }
}
