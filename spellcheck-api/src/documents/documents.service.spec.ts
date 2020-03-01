import {Test, TestingModule} from '@nestjs/testing';
import {DocumentsService} from './documents.service';
import {SpellcheckModule} from "../spellcheck/spellcheck.module";
import {Document} from "./db/document.entity";
import {MisspelledWord} from "./db/misspelledWord.entity";
import {SpellingSuggestion} from "./db/spellingSuggestion.entity";
import {createConnection, getConnection, getRepository, Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";
import {AddDocumentDto} from "./dto/addDocument.dto";
import {SpellcheckService} from "../spellcheck/spellcheck.service";

describe('DocumentsService', () => {
    const testConnectionName = 'testConnectionName';
    let service: DocumentsService;
    let connection;

    let documentsRepository;
    let misspelledWordsRepository;
    let spellingSuggestionsRepository;
    let spellcheckService;

    beforeEach(async () => {
        connection = await createConnection({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [Document, MisspelledWord, SpellingSuggestion],
            synchronize: true,
            logging: false,
            name: testConnectionName,
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [DocumentsService,
                {
                    provide: getRepositoryToken(Document),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(MisspelledWord),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(SpellingSuggestion),
                    useClass: Repository,
                },
            ],
            imports: [
                SpellcheckModule,
            ],
        }).compile();

        documentsRepository = getRepository(Document, testConnectionName);
        misspelledWordsRepository = getRepository(MisspelledWord, testConnectionName);
        spellingSuggestionsRepository = getRepository(SpellingSuggestion, testConnectionName);

        spellcheckService = module.get<SpellcheckService>(SpellcheckService);
        service = new DocumentsService(
            documentsRepository, misspelledWordsRepository,
            spellingSuggestionsRepository, spellcheckService
        );
    });

    afterEach(async () => {
        await getConnection(testConnectionName).close()
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should add new document', async () => {
        let documents = await documentsRepository.find();
        expect(documents.length).toBe(0);

        const dto = new AddDocumentDto();
        dto.body = 'big brown fox jumps over the lazy dog';
        await service.addDocument(dto);

        documents = await documentsRepository.find();
        expect(documents.length).toBe(1);
    });

    test('spellchecking of good document', async () => {
        const document = await service.addDocument({body: 'big brown fox jumps over the lazy dog'})
        await service.spellcheckDocument(document);
        expect(document.misspelledWords.length).toBe(0);
    });

    test('spellchecking of bad document', async () => {
        const document = await service.addDocument({body: 'big brwn fox jumps over the lazy dog'})
        await service.spellcheckDocument(document);
        expect(document.misspelledWords.length).toBe(1);
        expect(document.misspelledWords[0].spellingSuggestions.length).toBeGreaterThan(0);

        console.log(await service.getSpellingSuggestionsByIdIn([1,2]))
    });
});
