import 'isomorphic-fetch'
import { Server } from 'http'
import { request, gql } from 'graphql-request'
import express from 'express'
import graphql from './graphql'

let server: Server

describe('GraphQL API', () => {
  beforeAll(async () => {
    const app = express()

    await graphql(app)

    server = app.listen(4001)
  })

  afterAll(() => {
    server.close()
  })

  it('accepts a GraphQL query', async () => {
    const res = await request(
      'http://localhost:4001/graphql',
      gql`
        query GetUser($query: String!) {
          search(query: $query, type: USER, first: 10) {
            edges {
              node {
                __typename
                ... on User {
                  name
                }
              }
            }
          }
        }
      `,
      {
        query: 'lindsaykwardell',
      },
    )

    expect(res.search.edges[0].node.name === 'Lindsay Wardell')
  })
})
