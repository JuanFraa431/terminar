import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config.js';

export const initORM = async () => {
  return MikroORM.init(mikroOrmConfig);
};