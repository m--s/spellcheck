import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {Document} from "../src/documents/db/document.entity";
import {MisspelledWord} from "../src/documents/db/misspelledWord.entity";
import {SpellingSuggestion} from "../src/documents/db/spellingSuggestion.entity";

describe('SpellCheckController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: "sqlite",
                    database: ":memory:",
                    dropSchema: true,
                    entities: [Document, MisspelledWord, SpellingSuggestion],
                    synchronize: true,
                    logging: false,
                    namingStrategy: new SnakeNamingStrategy(),
                }),
                AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
       await app.close();
    });

    it('/document/add (POST) - invalid input', () => {
        return request(app.getHttpServer())
            .post('/document/add')
            .expect(400);
    });
    it('/document/add (POST) - valid input', () => {
        const body = {
            body: 'test',
        };
        return request(app.getHttpServer())
            .post('/document/add')
            .send(body)
            .expect(201);
    });
});
