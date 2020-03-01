export class SpellcheckingResult {
    text: string;
    suggestions: Map<string, string[]> = new Map<string, string[]>();
}
