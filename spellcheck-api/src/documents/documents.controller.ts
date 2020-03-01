import {Body, Controller, Get, Header, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {AddDocumentDto} from "./dto/addDocument.dto";
import {DocumentsService} from "./documents.service";
import {NewDocumentResponseDto} from "./dto/newDocumentResponse.dto";
import {ApplySuggestionsDto} from "./dto/applySuggestions.dto";
import {Document} from "./db/document.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {Response} from "express";
import {PassThrough} from "stream";

@Controller('document')
export class DocumentsController {
    constructor(private documentsService: DocumentsService) {}

    @Post('add')
    async addDocument(@Body() addDocumentDto: AddDocumentDto): Promise<NewDocumentResponseDto> {
        const document = await this.documentsService.addDocument(addDocumentDto);
        const checkedDocument = await this.documentsService.spellcheckDocument(document);
        return new NewDocumentResponseDto(checkedDocument);
    }

    @Post('addFile')
    @UseInterceptors(FileInterceptor('file'))
    async addDocumentFile(@UploadedFile() file) {
        const body = file.buffer.toString();
        const document = await this.documentsService.addDocument({body});
        const checkedDocument = await this.documentsService.spellcheckDocument(document);
        return new NewDocumentResponseDto(checkedDocument);
    }

    @Post('/applySuggestions')
    async applySuggestions(@Body() applySuggestionsDto: ApplySuggestionsDto): Promise<Document> {
        return this.documentsService.applySuggestions(applySuggestionsDto);
    }

    @Get('download/:id')
    @Header('Content-Type', 'text/plain')
    @Header('Content-disposition','attachment; filename=fixedText.txt')
    async downloadDocument(@Res() res: Response, @Param('id') id) {
        const document = await this.documentsService.getDocument(+id);
        const fileContents = Buffer.from(document.body);

        const readStream = new PassThrough();
        readStream.end(fileContents);
        readStream.pipe(res);
    }

    @Get(':id')
    async getDocument(@Param('id') id) {
        const document = await this.documentsService.getDocument(+id);
        return new NewDocumentResponseDto(document);
    }
}
