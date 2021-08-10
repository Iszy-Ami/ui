import {
  clearLocalStorage,
  setupData,
  testAddAnnotation,
} from '../util/annotationsSetup'

describe('The Annotations UI functionality on a band plot graph type', () => {
  const bandSuffix = 'band'

  beforeEach(() => setupData(cy, bandSuffix))
  afterEach(clearLocalStorage)

  it('can create an annotation on the band plot', () => {
    testAddAnnotation(cy)
  })
})
