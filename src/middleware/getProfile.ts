import type { RequestHandler } from 'express'

export const getProfile: RequestHandler = async (req, res, next) => {
  const { profileService } = req

  const profileId = parseInt(req.header('profile_id') ?? '')

  if (!profileId || isNaN(profileId)) {
    return res.status(401).end()
  }

  const profile = await profileService.getById(profileId)

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
