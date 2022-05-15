const chokidar = require('chokidar')
const path = require('path')
const { GraphQLDefinitionsFactory } = require('@nestjs/graphql')

const GRAPHQL_PATH = './src/**/*.graphql'
const OUTPUT_PATH = 'src/common/graphql/graphql.schema.ts'

const watch = process.argv.includes('--watch')

async function main () {
  await generateTypes()

  if (watch) {
    runWatch()
  }
}

function runWatch() {
  chokidar
    .watch(GRAPHQL_PATH, { interval: 250 })
    .on("change", generateTypes)
}

async function generateTypes() {
  const definitionsFactory = new GraphQLDefinitionsFactory()
  await definitionsFactory.generate({
    typePaths: [GRAPHQL_PATH],
    path: path.join(process.cwd(), OUTPUT_PATH),
    outputAs: 'class',
  })
}

main().catch(console.error)
