import { NSFWPolicyType } from '../videos/nsfw-policy.type'

export interface UserUpdateMe {
  displayName?: string
  description?: string
  nsfwPolicy?: NSFWPolicyType

  p2pEnabled?: boolean

  autoPlayVideo?: boolean
  autoPlayNextVideo?: boolean
  autoPlayNextVideoPlaylist?: boolean
  videosHistoryEnabled?: boolean
  videoLanguages?: string[]

  email?: string
  emailPublic?: boolean
  currentPassword?: string
  password?: string

  theme?: string

  noInstanceConfigWarningModal?: boolean
  noWelcomeModal?: boolean
  noAccountSetupWarningModal?: boolean
}
