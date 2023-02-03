import * as OpenApiValidator from 'express-openapi-validator'

export const openApiValidator = OpenApiValidator.middleware({
  apiSpec: './openapi.yaml',
  validateRequests: true,
  validateResponses: false,
})
