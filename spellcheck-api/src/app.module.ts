import {Module} from '@nestjs/common';
import {SpellcheckModule} from './spellcheck/spellcheck.module';
import {DocumentsModule} from './documents/documents.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: false,
        }),

        SpellcheckModule, DocumentsModule],
})
export class AppModule {
}
