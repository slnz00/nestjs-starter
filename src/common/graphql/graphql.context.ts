import { Request } from 'express'

export default class GraphQLContext {
  private readonly _req: Request

  constructor(req: Request) {
    this._req = req
  }
}
