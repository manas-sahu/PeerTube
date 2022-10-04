import { basename, join } from 'path'
import { logger } from '@server/helpers/logger'
import { CONFIG } from '@server/initializers/config'
import { MStreamingPlaylistVideo, MVideoFile } from '@server/types/models'
import { getHLSDirectory } from '../paths'
import { generateHLSObjectBaseStorageKey, generateHLSObjectStorageKey, generateWebTorrentObjectStorageKey } from './keys'
import { listKeysOfPrefix, lTags, makeAvailable, removeObject, removePrefix, storeObject } from './shared'

function listHLSFileKeysOf (playlist: MStreamingPlaylistVideo) {
  return listKeysOfPrefix(generateHLSObjectBaseStorageKey(playlist), CONFIG.OBJECT_STORAGE.STREAMING_PLAYLISTS)
}

// ---------------------------------------------------------------------------

function storeHLSFileFromFilename (playlist: MStreamingPlaylistVideo, filename: string) {
  return storeObject({
    inputPath: join(getHLSDirectory(playlist.Video), filename),
    objectStorageKey: generateHLSObjectStorageKey(playlist, filename),
    bucketInfo: CONFIG.OBJECT_STORAGE.STREAMING_PLAYLISTS
  })
}

function storeHLSFileFromPath (playlist: MStreamingPlaylistVideo, path: string) {
  return storeObject({
    inputPath: path,
    objectStorageKey: generateHLSObjectStorageKey(playlist, basename(path)),
    bucketInfo: CONFIG.OBJECT_STORAGE.STREAMING_PLAYLISTS
  })
}

// ---------------------------------------------------------------------------

function storeWebTorrentFile (filename: string) {
  return storeObject({
    inputPath: join(CONFIG.STORAGE.VIDEOS_DIR, filename),
    objectStorageKey: generateWebTorrentObjectStorageKey(filename),
    bucketInfo: CONFIG.OBJECT_STORAGE.VIDEOS
  })
}

// ---------------------------------------------------------------------------

function removeHLSObjectStorage (playlist: MStreamingPlaylistVideo) {
  return removePrefix(generateHLSObjectBaseStorageKey(playlist), CONFIG.OBJECT_STORAGE.STREAMING_PLAYLISTS)
}

function removeHLSFileObjectStorage (playlist: MStreamingPlaylistVideo, filename: string) {
  return removeObject(generateHLSObjectStorageKey(playlist, filename), CONFIG.OBJECT_STORAGE.STREAMING_PLAYLISTS)
}

// ---------------------------------------------------------------------------

function removeWebTorrentObjectStorage (videoFile: MVideoFile) {
  return removeObject(generateWebTorrentObjectStorageKey(videoFile.filename), CONFIG.OBJECT_STORAGE.VIDEOS)
}

// ---------------------------------------------------------------------------

async function makeHLSFileAvailable (playlist: MStreamingPlaylistVideo, filename: string, destination: string) {
  const key = generateHLSObjectStorageKey(playlist, filename)

  logger.info('Fetching HLS file %s from object storage to %s.', key, destination, lTags())

  await makeAvailable({
    key,
    destination,
    bucketInfo: CONFIG.OBJECT_STORAGE.STREAMING_PLAYLISTS
  })

  return destination
}

async function makeWebTorrentFileAvailable (filename: string, destination: string) {
  const key = generateWebTorrentObjectStorageKey(filename)

  logger.info('Fetching WebTorrent file %s from object storage to %s.', key, destination, lTags())

  await makeAvailable({
    key,
    destination,
    bucketInfo: CONFIG.OBJECT_STORAGE.VIDEOS
  })

  return destination
}

// ---------------------------------------------------------------------------

export {
  listHLSFileKeysOf,

  storeWebTorrentFile,
  storeHLSFileFromFilename,
  storeHLSFileFromPath,

  removeHLSObjectStorage,
  removeHLSFileObjectStorage,
  removeWebTorrentObjectStorage,

  makeWebTorrentFileAvailable,
  makeHLSFileAvailable
}
