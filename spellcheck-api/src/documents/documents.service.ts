import {BadRequestException, Injectable} from '@nestjs/common';
import {Document} from "./db/document.entity";
import {In, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {MisspelledWord} from "./db/misspelledWord.entity";
import {SpellingSuggestion} from "./db/spellingSuggestion.entity";
import {SpellcheckService} from "../spellcheck/spellcheck.service";
import {AddDocumentDto} from "./dto/addDocument.dto";
import {ApplySuggestionsDto} from "./dto/applySuggestions.dto";

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private readonly documentsRepository: Repository<Document>,
        @InjectRepository(MisspelledWord)
        private readonly misspelledWordsRepository: Repository<MisspelledWord>,
        @InjectRepository(SpellingSuggestion)
        private readonly spellingSuggestionsRepository: Repository<SpellingSuggestion>,
        private readonly spellcheckService: SpellcheckService,
    ) {
    }

    async addDocument(addDocumentDto: AddDocumentDto): Promise<Document> {
        return this.createDocument(addDocumentDto);
    }

    async spellcheckDocument(document: Document): Promise<Document> {
        const spellchecking = this.spellcheckService.checkTextSpelling(document.body);
        const misspelled = [...spellchecking.suggestions.keys()].map(word => this.misspelledWordsRepository.create({
            document,
            word
        }));
        document.misspelledWords = await this.misspelledWordsRepository.save(misspelled);

        for (const misspelledWord of document.misspelledWords) {
            const suggestions = spellchecking.suggestions
                .get(misspelledWord.word)
                .map(suggestion => this.spellingSuggestionsRepository.create({
                    misspelledWord,
                    suggestion
                }));
            misspelledWord.spellingSuggestions = await this.spellingSuggestionsRepository.save(suggestions);
        }
        return document;
    }

    async createDocument(addDocumentDto: AddDocumentDto): Promise<Document> {
        const document = this.documentsRepository.create(addDocumentDto);
        return this.documentsRepository.save(document);
    }

    async applySuggestions(applySuggestionsDto: ApplySuggestionsDto): Promise<Document> {
        const document = await this.documentsRepository.findOneOrFail(applySuggestionsDto.documentId);
        const suggestions = await this.getSpellingSuggestionsByIdIn(applySuggestionsDto.suggestionIds);

        let text = document.body;
        for (const spellingSuggestion of suggestions) {
            text = this.spellcheckService.applySpellingSuggestion(
                text, spellingSuggestion.misspelledWord.word, spellingSuggestion.suggestion
            );
            spellingSuggestion.taken = true;
        }
        await this.spellingSuggestionsRepository.save(suggestions);

        document.body = text;
        document.accepted = true;

        await this.documentsRepository.save(document);

        return document;
    }

    async getSpellingSuggestionsByIdIn(ids: number[]): Promise<SpellingSuggestion[]> {
        if (!ids.length) {
            return [];
        }
        return this.spellingSuggestionsRepository.find({
            where: { id: In(ids) },
            relations: ['misspelledWord']
        });
    }

    async getDocument(id: number) {
        const document = this.documentsRepository.createQueryBuilder('document')
            .where('document.id = :id', {id})
            .leftJoinAndMapMany(
                'document.misspelledWords', MisspelledWord, 'misspelledWord',
                '"misspelledWord"."documentId" = document.id'
            ).leftJoinAndMapMany(
                'misspelledWord.spellingSuggestions', SpellingSuggestion, 'spellingSuggestion',
                '"spellingSuggestion"."misspelledWordId" = "misspelledWord".id'
            ).getOne();
        if (!document) {
            throw new BadRequestException('Invalid id');
        }
        return document;
    }
}
