import { Module } from '@nestjs/common';
import { SpellcheckService } from './spellcheck.service';

@Module({
    providers: [SpellcheckService],
    exports: [SpellcheckService],
})
export class SpellcheckModule {}
