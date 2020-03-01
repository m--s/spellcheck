import {Test, TestingModule} from '@nestjs/testing';
import {SpellcheckService} from './spellcheck.service';

describe('SpellcheckService', () => {
    let service: SpellcheckService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SpellcheckService],
        }).compile();

        service = module.get<SpellcheckService>(SpellcheckService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('detects invalid word', () => {
        expect(service.isWordValid('test')).toBe(true);
        expect(service.isWordValid('tust')).toBe(false);
    });

    it('returns word suggestions', () => {
        expect(service.getSuggestions('tust').length).toBeGreaterThan(0);
    });

    it('splits sentence into words', () => {
        expect(service.splitSentenceIntoWords('test')).toStrictEqual(['test']);
        expect(service.splitSentenceIntoWords(
            'big brown? fox! jumps. over, the "lazy dog"')
        ).toStrictEqual(['big', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog']);

    });

    it('detects if it should be spellchecked', () => {
        expect(service.shouldBeSpellchecked('lazy')).toBe(true);
        expect(service.shouldBeSpellchecked('dry-cleaning')).toBe(true);
        expect(service.shouldBeSpellchecked(`Randys'`)).toBe(true);

        expect(service.shouldBeSpellchecked('dry-cleaning1')).toBe(false);
    });

    it('spellchecks text', () => {
        const text = 'big brown fox jumps over the lazy dog';
        const badText = text.replace('brown', 'brwn');

        let spellcheckingResult = service.checkTextSpelling(text);
        expect(spellcheckingResult.text).toStrictEqual(text);

        spellcheckingResult = service.checkTextSpelling(badText);
        expect(spellcheckingResult.text).toStrictEqual(badText);
        expect([...spellcheckingResult.suggestions.keys()].length).toBe(1);
        expect(spellcheckingResult.suggestions.get('brwn')).toContain('brown');
    });

    it('applies spelling suggestions', () => {
        expect(
            service.applySpellingSuggestion(
                'big brwn? brwnfox! jumps. overbrwn, the "lazy dog"', 'brwn', 'brown'
            )
        ).toStrictEqual('big brown? brwnfox! jumps. overbrwn, the "lazy dog"');

        expect(
            service.applySpellingSuggestion(
                'big brwn? brwnfox! jumps. overbrwn, the "lazy dog" brwn brwn!', 'brwn', 'brown'
            )
        ).toStrictEqual('big brown? brwnfox! jumps. overbrwn, the "lazy dog" brown brown!');

    });

});
