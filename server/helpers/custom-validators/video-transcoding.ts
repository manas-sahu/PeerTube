import { exists } from './misc'

function isValidCreateTranscodingType (value: any) {
  return exists(value) &&
    (value === 'hls' || value === 'webtorrent' || value === 'web-video') // TODO: remove webtorrent in v7
}

// ---------------------------------------------------------------------------

export {
  isValidCreateTranscodingType
}
