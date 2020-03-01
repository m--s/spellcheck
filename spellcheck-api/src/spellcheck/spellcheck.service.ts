import { Injectable } from '@nestjs/common';
import * as Typo from 'typo-js';
import {SpellcheckingResult} from "./spellcheckingResult";

@Injectable()
export class SpellcheckService {
    private typo = new Typo('en_US');

    checkTextSpelling(text: string): SpellcheckingResult {
        const result = new SpellcheckingResult();
        result.text = text;

        const words = this.splitSentenceIntoWords(text);
        const alphaOnlyWords = words.filter(this.shouldBeSpellchecked);
        const invalidWords = alphaOnlyWords.filter(word => !this.isWordValid(word));

        invalidWords.forEach((word) => {
            result.suggestions.set(word, this.getSuggestions(word));
        });
        return result;
    }

    applySpellingSuggestion(text: string, misspelledWord: string, correctWord: string) {
        return text.replace(new RegExp('\\b' + misspelledWord + '\\b', 'g'), correctWord);
    }

    splitSentenceIntoWords(sentence: string): string[] {
        // replace all (multiple) whitespaces into single space
        const normalizedWhitespaces = sentence.replace(/\r?\n|\r/, ' ').replace(/\s\s+/g, ' ');

        const splitted = normalizedWhitespaces.split(' ');
        return splitted.map(word => word.replace(/[\.|,|?|!|"]/g, ''));
    }

    /**
     * Returns if word should be spellcheked - only alpha and "-", "'"
     * @param {string} word
     * @returns {boolean}
     */
    shouldBeSpellchecked(word: string): boolean {
        const pattern = /^[A-Za-z\-\']+$/;
        return pattern.test(word);
    }

    isWordValid(word: string): boolean {
        return this.typo.check(word);
    }

    getSuggestions(word: string): string[] {
        return this.typo.suggest(word);
    }
}
