import 'isomorphic-fetch'
// import app from './api'
import graphql from './graphql'
import express from 'express'
import { Server } from 'http'
import { request, gql } from 'graphql-request'

let server: Server

describe('GraphQL API', () => {
  beforeAll(async () => {
    const app = express()

    await graphql(app)
    
    server = app.listen(4000)
  })

  afterAll(() => {
    server.close()
  })

  it('accepts a GraphQL query', async () => {
    const res = await request(
      'http://localhost:4000/graphql',
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
      }
    )

    expect(res.search.edges[0].node.name === "Lindsay Wardell")
  })
})