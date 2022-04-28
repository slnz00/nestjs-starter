import { Request } from 'express'

export default class GraphQLContext {
  readonly req: Request

  constructor(req: Request) {
    this.req = req
  }
}
