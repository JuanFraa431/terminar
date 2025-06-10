import { Options, MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Nota } from '../entities/nota';
import { Etiqueta } from '../entities/etiqueta';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import * as dotenv from 'dotenv';
dotenv.config();

const mikroOrmConfig = {
    entitiesTs: ['./src/entities/*.ts'],
    entities: ['./dist/entities/nota.js', './dist/entities/etiqueta.js'],
    dbName: 'b3qrjxwgcflcqrmb39yb',
    driver: MySqlDriver,
    clientUrl: 'mysql://udsdejnepeod4dhj:8aPePUfQOOhPsBIaa68w@b3qrjxwgcflcqrmb39yb-mysql.services.clever-cloud.com:3306/b3qrjxwgcflcqrmb39yb',
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: {
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
};


export default mikroOrmConfig;

