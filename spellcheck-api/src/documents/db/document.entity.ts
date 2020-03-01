import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {MisspelledWord} from "./misspelledWord.entity";

@Entity()
export class Document {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    body: string;

    @Column()
    accepted: boolean = false;

    @OneToMany(type => MisspelledWord, mispelledWord => mispelledWord.document)
    misspelledWords: MisspelledWord[];
}
