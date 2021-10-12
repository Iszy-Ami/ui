import {
  bucketVariable,
  deploymentVariable,
  buildVariable,
  variables,
} from 'src/shared/utils/mocks/data'

import {filterUnusedVarsBasedOnQuery} from 'src/shared/utils/filterUnusedVars'

// TODO: As part of #1708, move the contents of this file to filterUnusedVars.test.ts and remove this file.
describe('filterUnusedVars', () => {
  beforeAll(() => {
    window.influx.set('filterExtern', true)
  })

  afterAll(() => {
    window.influx.set('filterExtern', false)
  })

  describe('filterUnusedVarsBasedOnQuery', () => {
    it('returns an empty array when no variables or queries are passed', () => {
      const actual = filterUnusedVarsBasedOnQuery([], [])
      expect(actual).toEqual([])
    })
    it('returns an empty array when no query is passed', () => {
      const actual = filterUnusedVarsBasedOnQuery(variables, [])
      expect(actual).toEqual([])
    })
    it("returns an empty array when the query doesn't contain a variable", () => {
      const actual = filterUnusedVarsBasedOnQuery(variables, ['random query'])
      expect(actual).toEqual([])
    })
    it('returns a variable when it exists in the query and does not depend on another query', () => {
      const query = 'v.bucket'
      const actual = filterUnusedVarsBasedOnQuery(variables, [query])
      expect(actual).toEqual([bucketVariable])
    })
    it('returns a variable and its dependent variables when dependencies exist', () => {
      const actual = filterUnusedVarsBasedOnQuery(variables, ['v.deployment'])
      expect(actual).toEqual([deploymentVariable, bucketVariable])
    })
    it('returns a variable and its deeply nested dependent variables', () => {
      const actual = filterUnusedVarsBasedOnQuery(variables, ['v.build'])
      expect(actual).toEqual([
        buildVariable,
        bucketVariable,
        deploymentVariable,
      ])
    })
  })
})
