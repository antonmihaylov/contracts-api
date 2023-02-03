import * as env from 'env-var'
import { Sequelize } from 'sequelize'
import type { Dialect } from 'sequelize/types/sequelize'

const SQL_DIALECT = env.get('SQL_DIALECT').default('sqlite').asString()
const SQL_STORAGE = env.get('SQL_STORAGE').default('./database.sqlite3').asString()

export const sequelize = new Sequelize({
  dialect: SQL_DIALECT as Dialect,
  storage: SQL_STORAGE,
})
