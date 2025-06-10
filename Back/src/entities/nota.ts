import {
    Entity,
    PrimaryKey,
    Property,
    ManyToMany,
    Collection,
    Cascade,
} from '@mikro-orm/core';
import { Etiqueta } from './etiqueta.js';

@Entity({ tableName: 'notas' })
export class Nota {
    @PrimaryKey()
    id!: number;

    @Property()
    titulo!: string;

    @Property()
    contenido!: string;

    @Property({ default: false })
    archivada: boolean = false;

    @Property({ onCreate: () => new Date() })
    creadoEn: Date = new Date();

    @Property({ onUpdate: () => new Date(), nullable: true })
    actualizadoEn?: Date;

    @ManyToMany(() => Etiqueta, etiqueta => etiqueta.notas, { cascade: [Cascade.ALL], owner: true })
    etiquetas = new Collection<Etiqueta>(this);
}