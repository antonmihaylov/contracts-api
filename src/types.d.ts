import type { InferAttributes } from 'sequelize'

import type { Profile } from './models'

declare global {
  namespace Express {
    export interface Request {
      profile?: Readonly<InferAttributes<Profile>>
    }
  }
}
