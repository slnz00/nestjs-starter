import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import GraphQLContext from 'common/graphql/graphql.context'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      path: 'api/graphql',
      typePaths: ['./**/*.graphql'],
      context: ({ req }: any) => new GraphQLContext(req),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault],
    }),
  ],
})
export default class AppModule {}
