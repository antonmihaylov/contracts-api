import type { InferAttributes } from 'sequelize'

import type { Profile } from './models'

export type ProfileData = Readonly<InferAttributes<Profile>>

declare global {
  namespace Express {
    export interface Request {
      profile?: ProfileData
    }
  }
}
