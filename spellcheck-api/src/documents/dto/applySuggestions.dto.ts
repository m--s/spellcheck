import {IsNotEmpty, IsNumber} from "class-validator";

export class ApplySuggestionsDto {
    @IsNotEmpty()
    @IsNumber()
    documentId: number;

    @IsNumber({}, {
        each: true,
    })
    suggestionIds?: number[];
}
