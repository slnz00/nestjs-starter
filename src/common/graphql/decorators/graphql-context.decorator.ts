import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import GraphQLContext from 'common/graphql/graphql.context'

const GQLContext = createParamDecorator((_data: unknown, ctx: ExecutionContext): GraphQLContext => {
  return GqlExecutionContext.create(ctx).getContext<GraphQLContext>()
})

export default GQLContext
