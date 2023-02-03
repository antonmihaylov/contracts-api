import type { RequestHandler } from 'express'
import type { Transaction } from 'sequelize'

export const transactionMiddlewareFactory =
  (transaction: Transaction): RequestHandler =>
  async (req, res, next) => {
    req.transaction = transaction

    next()
  }
