import {Module} from '@nestjs/common';
import {DocumentsService} from './documents.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Document} from "./db/document.entity";
import {MisspelledWord} from "./db/misspelledWord.entity";
import {SpellingSuggestion} from "./db/spellingSuggestion.entity";
import {SpellcheckModule} from "../spellcheck/spellcheck.module";
import {DocumentsController} from "./documents.controller";
import {MulterModule} from "@nestjs/platform-express";

@Module({
    providers: [DocumentsService],
    imports: [
        SpellcheckModule,
        TypeOrmModule.forFeature([Document, MisspelledWord, SpellingSuggestion]),
    ],
    controllers: [DocumentsController],
    exports: [DocumentsService],
})
export class DocumentsModule {
}
