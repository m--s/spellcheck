import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {MisspelledWord} from "./misspelledWord.entity";

@Entity()
export class SpellingSuggestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    suggestion: string;

    @Column()
    taken: boolean = false;

    @ManyToOne(type => MisspelledWord, misspelledWord => misspelledWord.spellingSuggestions)
    misspelledWord: MisspelledWord;
}
