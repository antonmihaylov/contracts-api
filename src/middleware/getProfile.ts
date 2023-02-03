import type { RequestHandler } from 'express'

import type { Models } from '../models'

export const getProfile: RequestHandler = async (req, res, next) => {
  const { Profile } = req.app.get('models') as Models

  const profileId = req.header('profile_id')

  if (!profileId) {
    return res.status(401).end()
  }

  const profile = await Profile.findOne({ where: { id: profileId } })

  if (!profile) return res.status(401).end()

  req.profile = {
    type: profile.type,
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    profession: profile.profession,
    balance: profile.balance,
  }

  next()
}
