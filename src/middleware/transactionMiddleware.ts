import type { RequestHandler } from 'express'

import { sequelize } from '../models/Sequelize'

const mutatingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * Makes sure that all requests are wrapped in a transaction.
 * Enabled only for mutating (POST, PUT, PATCH and DELETE) requests.
 */
export const transactionMiddleware: RequestHandler = async (req, res, next) => {
  if (mutatingMethods.has(req.method)) {
    req.transaction = await sequelize.transaction()

    const oldSend = res.send

    res.send = (...args) => {
      const original = () => oldSend.call(res, ...args)

      if (res.statusCode >= 400) {
        void req.transaction?.rollback().then(original)
      } else {
        void req.transaction?.commit().then(original)
      }

      return res
    }
  }

  next()
}
