import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Document} from "./document.entity";
import {SpellingSuggestion} from "./spellingSuggestion.entity";
import {Exclude, Transform} from "class-transformer";

@Entity()
export class MisspelledWord {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    word: string;

    @ManyToOne(type => Document, document => document.misspelledWords)
    @Transform(document => document.id)
    @Exclude()
    document: Document;

    @OneToMany(type => SpellingSuggestion, spellingSuggestion => spellingSuggestion.misspelledWord)
    spellingSuggestions: SpellingSuggestion[];
}
