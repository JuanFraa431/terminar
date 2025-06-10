import { Entity, PrimaryKey, Property, ManyToMany, Collection } from '@mikro-orm/core';
import { Nota } from './nota.js';

@Entity({ tableName: 'etiquetas' })
export class Etiqueta {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  nombre!: string;

  @ManyToMany(() => Nota, nota => nota.etiquetas)
  notas = new Collection<Nota>(this);
}