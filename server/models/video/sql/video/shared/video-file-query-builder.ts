import { Sequelize, Transaction } from 'sequelize'
import { AbstractVideoQueryBuilder } from './abstract-video-query-builder'

export type FileQueryOptions = {
  id?: string | number
  url?: string

  includeRedundancy: boolean

  transaction?: Transaction

  logging?: boolean
}

/**
 *
 * Fetch files (web videos and streaming playlist) according to a video
 *
 */

export class VideoFileQueryBuilder extends AbstractVideoQueryBuilder {
  protected attributes: { [key: string]: string }

  constructor (protected readonly sequelize: Sequelize) {
    super(sequelize, 'get')
  }

  queryWebVideos (options: FileQueryOptions) {
    this.buildWebVideoFilesQuery(options)

    return this.runQuery(options)
  }

  queryStreamingPlaylistVideos (options: FileQueryOptions) {
    this.buildVideoStreamingPlaylistFilesQuery(options)

    return this.runQuery(options)
  }

  private buildWebVideoFilesQuery (options: FileQueryOptions) {
    this.attributes = {
      '"video"."id"': ''
    }

    this.includeWebVideoFiles()

    if (options.includeRedundancy) {
      this.includeWebVideoRedundancies()
    }

    this.whereId(options)

    this.query = this.buildQuery()
  }

  private buildVideoStreamingPlaylistFilesQuery (options: FileQueryOptions) {
    this.attributes = {
      '"video"."id"': ''
    }

    this.includeStreamingPlaylistFiles()

    if (options.includeRedundancy) {
      this.includeStreamingPlaylistRedundancies()
    }

    this.whereId(options)

    this.query = this.buildQuery()
  }

  private buildQuery () {
    return `${this.buildSelect()} FROM "video" ${this.joins} ${this.where}`
  }
}
