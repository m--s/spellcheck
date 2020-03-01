import { IsNotEmpty } from 'class-validator';

export class AddDocumentDto {
    @IsNotEmpty()
    body: string;
}
