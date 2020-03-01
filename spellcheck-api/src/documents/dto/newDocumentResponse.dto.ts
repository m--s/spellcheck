import {Document} from "../db/document.entity";
import {MisspelledWord} from "../db/misspelledWord.entity";
import {SpellingSuggestion} from "../db/spellingSuggestion.entity";

class SpellingSuggestionDto {
    id: number;
    suggestion: string;
    taken: boolean;

    constructor(spellingSuggestion: SpellingSuggestion) {
        this.id = spellingSuggestion.id;
        this.suggestion = spellingSuggestion.suggestion;
        this.taken = spellingSuggestion.taken;
    }
}

class MisspelledWordDto  {
    id: number;
    word: string;
    suggestions: SpellingSuggestionDto[];

    constructor(misspelledWord: MisspelledWord) {
        this.id = misspelledWord.id;
        this.word = misspelledWord.word;
        this.suggestions = misspelledWord.spellingSuggestions.map(suggestion => new SpellingSuggestionDto(suggestion));
    }
}

export class NewDocumentResponseDto {
    id: number;
    body: string;
    misspelledWords: MisspelledWordDto[];
    accepted: boolean;

    constructor(document: Document) {
        this.id = document.id;
        this.body = document.body;
        this.accepted = document.accepted;
        this.misspelledWords = document.misspelledWords.map(misspelledWord => new MisspelledWordDto(misspelledWord));
    }
}
