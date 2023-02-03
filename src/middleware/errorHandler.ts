import type { ErrorRequestHandler } from 'express'
import httpErrors from 'http-errors'
import type { Error } from 'sequelize'

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- next is required for express error handlers
export const errorHandler: ErrorRequestHandler = (err: Error, req, res, next) => {
  console.error(err)

  if (httpErrors.isHttpError(err)) {
    res.status(err.status).json(
      err.expose
        ? {
            message: err.message,
            type: err.name,
          }
        : {
            message: 'Something went wrong',
          },
    )
  } else {
    const status = 'status' in err && typeof err.status === 'number' ? err.status : 500
    res.status(status).json({
      message: err.message,
      type: err.name,
    })
  }
}
