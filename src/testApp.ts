import type { Transaction } from 'sequelize'

import { createApp } from './app'
import { transactionMiddlewareFactory } from './middleware/testTransactionMiddleware'

export function createTestApp(transaction: Transaction) {
  return createApp({
    transactionMiddleware: transactionMiddlewareFactory(transaction),
  })
}
