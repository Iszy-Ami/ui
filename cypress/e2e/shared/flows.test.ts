import {Organization} from '../../src/types'

describe('Flows', () => {
  beforeEach(() =>
    cy.flush().then(() =>
      cy.signin().then(() =>
        cy.get('@org').then(({id}: Organization) =>
          cy.fixture('routes').then(({orgs}) => {
            cy.visit(`${orgs}/${id}`)
            cy.getByTestID('version-info')
            return cy
              .setFeatureFlags({
                notebooksExp: true,
              })
              .then(() => {
                cy.getByTestID('nav-item-flows').should('be.visible')
                return cy.getByTestID('nav-item-flows').click()
              })
          })
        )
      )
    )
  )

  it('CRUD a flow from the index page', () => {
    const now = Date.now()
    cy.writeData(
      [
        `test,container_name=cool dopeness=12 ${now - 1000}000000`,
        `test,container_name=beans dopeness=18 ${now - 1200}000000`,
        `test,container_name=cool dopeness=14 ${now - 1400}000000`,
        `test,container_name=beans dopeness=10 ${now - 1600}000000`,
      ],
      'defbuck'
    )
    cy.getByTestID('preset-new')
      .first()
      .click()

    cy.getByTestID('time-machine-submit-button').should('be.visible')

    cy.getByTestID('page-title').click()
    cy.getByTestID('renamable-page-title--input').type('My Flow {enter}')

    cy.getByTestID('sidebar-button')
      .first()
      .click()
    cy.getByTestID('Delete--list-item').click()

    cy.getByTestID('panel-add-btn--1').click()
    cy.getByTestID('add-flow-btn--queryBuilder').click()
    cy.getByTestID('selector-list defbuck')
      .first()
      .click()
    cy.getByTestID('selector-list test')
      .first()
      .click()

    cy.getByTestID('time-machine-submit-button').click()

    cy.getByTestID('panel-add-btn-1').click()

    cy.getByTestID('add-flow-btn--visualization').click()
  })

  // NOTE: we are hiding the metric selector from users for now
  it.skip('can create a bucket from the metric selector and verify it is selected', () => {
    const newBucketName = 'IDontGiveABuck'
    cy.getByTestID('preset-new')
      .first()
      .click()

    cy.getByTestID('time-machine-submit-button').should('be.visible')
    cy.getByTestID('page-title').click()
    cy.getByTestID('renamable-page-title--input').type('My Flow {enter}')

    cy.getByTestID('sidebar-button')
      .first()
      .click()
    cy.getByTestID('Delete--list-item').click()

    cy.getByTestID('panel-add-btn--1').click()
    cy.getByTestID('add-flow-btn--metricSelector').click()
    cy.getByTestID('flow-bucket-selector')
      .click()
      .then(() => {
        cy.getByTestID('flow-bucket-selector--create').click()
      })

    cy.getByTestID('overlay').should('exist')

    cy.getByTestID('bucket-form-name').type(newBucketName)
    cy.getByTestID('bucket-form-submit')
      .click()
      .then(() => {
        cy.getByTestID('flow-bucket-selector').within(() => {
          cy.contains(newBucketName).should('exist')
        })
      })
  })

  it('can execute preview, see results, change tags, execute preview, see different results', () => {
    const newBucketName = 'lets goooo'
    const now = Date.now()
    cy.get<Organization>('@org').then(({id, name}: Organization) => {
      cy.createBucket(id, name, newBucketName)
    })
    cy.writeData(
      [
        `test,container_name=cool dopeness=12 ${now - 1000}000000`,
        `test,container_name=beans dopeness=18 ${now - 1200}000000`,
        `test,container_name=cool dopeness=14 ${now - 1400}000000`,
        `test,container_name=beans dopeness=10 ${now - 1600}000000`,
      ],
      newBucketName
    )

    cy.getByTestID('preset-new')
      .first()
      .click()
    cy.getByTestID('time-machine-submit-button').should('be.visible')

    cy.getByTestID('page-title').click()
    cy.getByTestID('renamable-page-title--input').type('My Flow {enter}')

    // select our bucket
    cy.getByTestID('sidebar-button')
      .first()
      .click()
    cy.getByTestID('Delete--list-item').click()

    cy.getByTestID('panel-add-btn--1').click()

    cy.getByTestID('add-flow-btn--queryBuilder').click()
    cy.getByTestID('bucket-selector').within(() => {
      cy.getByTestID('selector-list lets goooo').click()
    })

    // select measurement and field
    cy.getByTestID('builder-card')
      .eq(0)
      .within(() => {
        cy.getByTestID(`selector-list test`).click()
      })
    cy.getByTestID('builder-card')
      .eq(1)
      .within(() => {
        cy.getByTestID(`selector-list dopeness`).click()
      })
    // select beans tag and click preview
    cy.getByTestID('builder-card')
      .eq(2)
      .within(() => {
        cy.getByTestID(`selector-list beans`).click()
      })

    cy.getByTestID('time-machine-submit-button').click()

    // we should only see beans in the table
    cy.getByTestID('simple-table').should('be.visible')
    cy.getByTestID('table-cell beans')
      .first()
      .should('be.visible')
    cy.getByTestID('table-cell cool').should('not.exist')

    // change tag to cool and click preview
    cy.getByTestID('builder-card')
      .eq(2)
      .within(() => {
        cy.getByTestID(`selector-list cool`).click()
      })
    cy.getByTestID('time-machine-submit-button').click()

    // we should only see cool in the table
    cy.getByTestID('simple-table').should('be.visible')
    cy.getByTestID('table-cell cool')
      .first()
      .should('be.visible')
  })

  it('can create, clone a flow and persist selected data in the clone, and delete a flow from the list page', () => {
    const newBucketName = 'shmucket'
    const now = Date.now()
    cy.get<Organization>('@org').then(({id, name}: Organization) => {
      cy.createBucket(id, name, newBucketName)
    })
    cy.writeData(
      [
        `test,container_name=cool dopeness=12 ${now - 1000}000000`,
        `test,container_name=beans dopeness=18 ${now - 1200}000000`,
        `test,container_name=cool dopeness=14 ${now - 1400}000000`,
        `test,container_name=beans dopeness=10 ${now - 1600}000000`,
      ],
      newBucketName
    )

    const flowName = 'Flowbooks'

    cy.getByTestID('preset-new')
      .first()
      .click()
    cy.getByTestID('time-machine-submit-button').should('be.visible')
    cy.intercept('PATCH', '**/notebooks/*').as('updateNotebook')

    cy.getByTestID('page-title').click()
    cy.getByTestID('renamable-page-title--input').type(`${flowName}`)

    // select our bucket
    cy.getByTestID('sidebar-button')
      .first()
      .click()
    cy.getByTestID('Delete--list-item').click()

    cy.getByTestID('panel-add-btn--1').click()

    cy.getByTestID('add-flow-btn--queryBuilder').click()
    cy.getByTestID('bucket-selector').within(() => {
      cy.getByTestID(`selector-list ${newBucketName}`).click()
    })

    // select measurement and field
    cy.getByTestID('builder-card')
      .eq(0)
      .within(() => {
        cy.getByTestID(`selector-list test`).click()
      })
    cy.getByTestID('builder-card')
      .eq(1)
      .within(() => {
        cy.getByTestID(`selector-list dopeness`).click()
      })
    // select beans tag and click preview
    cy.getByTestID('builder-card')
      .eq(2)
      .within(() => {
        cy.getByTestID(`selector-list beans`).click()
      })

    cy.wait('@updateNotebook')

    cy.getByTestID('time-machine-submit-button').click()

    // we should only see beans in the table
    cy.getByTestID('simple-table').should('be.visible')
    cy.getByTestID('table-cell beans')
      .first()
      .should('be.visible')
    cy.getByTestID('table-cell cool').should('not.exist')

    // This is a random validator that the autorefresh option doesn't pop up
    // In Flows again without explicit changes
    cy.getByTestID('autorefresh-dropdown--button').should('not.exist')

    cy.clickNavBarItem('nav-item-flows')

    cy.get('.cf-resource-card').should('have.length', 1)

    cy.getByTestID('resource-editable-name').contains(`${flowName}`)

    cy.getByTestID(`flow-card--${flowName}`).within(() => {
      cy.getByTestID(`context-menu-flow`).click()
    })
    cy.getByTestID(`context-clone-flow`).click()
    cy.getByTestID('time-machine-submit-button').should('exist')

    const clone = `${flowName} (clone 1)`

    // Should redirect the user to the newly cloned flow
    // Validates that the selected clone is the clone
    cy.getByTestID('page-title').contains(`${clone}`)

    cy.clickNavBarItem('nav-item-flows')

    cy.get('.cf-resource-card').should('have.length', 2)
    cy.getByTestID('resource-editable-name')
      .last()
      .contains(`${clone}`)

    // Delete the cloned flow
    cy.getByTestID(`flow-card--${clone}`).within(() => {
      cy.getByTestID(`context-delete-menu--button`).click()
    })
    cy.getByTestID(`context-delete-menu--confirm-button`).click()

    cy.get('.cf-resource-card').should('have.length', 1)
    cy.getByTestID('resource-editable-name').contains(`${flowName}`)
  })

  it('should not run Preview when presentation mode is off', () => {
    const newBucketName = 'shmucket'
    const now = Date.now()
    cy.get<Organization>('@org').then(({id, name}: Organization) => {
      cy.createBucket(id, name, newBucketName)
    })
    cy.writeData(
      [
        `test,container_name=cool dopeness=12 ${now - 1000}000000`,
        `test,container_name=beans dopeness=18 ${now - 1200}000000`,
        `test,container_name=cool dopeness=14 ${now - 1400}000000`,
        `test,container_name=beans dopeness=10 ${now - 1600}000000`,
      ],
      newBucketName
    )

    const flowName = 'Flowbooks'

    cy.getByTestID('preset-new')
      .first()
      .click()
    cy.getByTestID('time-machine-submit-button').should('be.visible')

    cy.getByTestID('page-title').click()
    cy.getByTestID('renamable-page-title--input').type(`${flowName}`)

    // select our bucket
    cy.getByTestID('sidebar-button')
      .first()
      .click()
    cy.getByTestID('Delete--list-item').click()

    cy.getByTestID('panel-add-btn--1').click()

    cy.getByTestID('add-flow-btn--queryBuilder').click()
    cy.getByTestID('bucket-selector').within(() => {
      cy.getByTestID(`selector-list ${newBucketName}`).click()
    })

    // select measurement and field
    cy.getByTestID('builder-card')
      .eq(0)
      .within(() => {
        cy.getByTestID(`selector-list test`).click()
      })
    cy.getByTestID('builder-card')
      .eq(1)
      .within(() => {
        cy.getByTestID(`selector-list dopeness`).click()
      })
    // select beans tag and click preview
    cy.getByTestID('builder-card')
      .eq(2)
      .within(() => {
        cy.getByTestID(`selector-list beans`).click()
      })

    cy.getByTestID('time-machine-submit-button').click()

    // we should only see beans in the table
    cy.getByTestID('simple-table').should('be.visible')
    cy.getByTestID('table-cell beans')
      .first()
      .should('be.visible')
    cy.getByTestID('table-cell cool').should('not.exist')

    // exit the flow, reload, and come back in
    cy.clickNavBarItem('nav-item-flows')
    cy.reload()
    cy.getByTestID('tree-nav').should('be.visible')
    cy.getByTestID('resource-editable-name').should('exist')
    cy.getByTestID('resource-editable-name').click()

    // visualizations should not exist
    cy.getByTestID('simple-table').should('not.exist')
    cy.getByTestID('giraffe-inner-plot').should('not.exist')
  })

  it('should run Preview when presentation mode is on', () => {
    const newBucketName = 'shmucket'
    const now = Date.now()
    cy.get<Organization>('@org').then(({id, name}: Organization) => {
      cy.createBucket(id, name, newBucketName)
    })
    cy.writeData(
      [
        `test,container_name=cool dopeness=12 ${now - 1000}000000`,
        `test,container_name=beans dopeness=18 ${now - 1200}000000`,
        `test,container_name=cool dopeness=14 ${now - 1400}000000`,
        `test,container_name=beans dopeness=10 ${now - 1600}000000`,
      ],
      newBucketName
    )

    const flowName = 'Flowbooks'

    cy.getByTestID('preset-new')
      .first()
      .click()
    cy.getByTestID('time-machine-submit-button').should('be.visible')

    cy.getByTestID('page-title').click()
    cy.getByTestID('renamable-page-title--input').type(`${flowName}`)

    // select our bucket
    cy.getByTestID('sidebar-button')
      .first()
      .click()
    cy.getByTestID('Delete--list-item').click()

    cy.getByTestID('panel-add-btn--1').click()
    cy.getByTestID('add-flow-btn--queryBuilder').click()
    cy.getByTestID('bucket-selector').within(() => {
      cy.getByTestID(`selector-list ${newBucketName}`).click()
    })

    // select measurement and field
    cy.getByTestID('builder-card')
      .eq(0)
      .within(() => {
        cy.getByTestID(`selector-list test`).click()
      })
    cy.getByTestID('builder-card')
      .eq(1)
      .within(() => {
        cy.getByTestID(`selector-list dopeness`).click()
      })
    // select beans tag and click preview
    cy.getByTestID('builder-card')
      .eq(2)
      .within(() => {
        cy.getByTestID(`selector-list beans`).click()
      })

    cy.getByTestID('time-machine-submit-button').click()

    // we should only see beans in the table
    cy.getByTestID('simple-table').should('be.visible')
    cy.getByTestID('table-cell beans')
      .first()
      .should('be.visible')
    cy.getByTestID('table-cell cool').should('not.exist')

    cy.intercept('PATCH', '**/notebooks/*', req => {
      if (req.body.spec.readOnly === true) {
        req.alias = 'notebooksSave'
      }
    })

    // enable presentation mode
    cy.getByTestID('slide-toggle').click()

    // wait for notebook to save
    cy.wait('@notebooksSave')

    // exit the flow, reload, and come back in
    cy.clickNavBarItem('nav-item-flows')
    cy.reload()
    cy.getByTestID('tree-nav').should('be.visible')
    cy.getByTestID('resource-editable-name').should('exist')
    cy.getByTestID('resource-editable-name').click()

    // visualizations should exist
    cy.getByTestID('giraffe-inner-plot')
      .scrollIntoView()
      .should('be.visible')
  })

  describe('alert panel', () => {
    it('should build expressions list and allow for injection', () => {
      const newBucketName = 'shmucket'
      const now = Date.now()
      cy.get<Organization>('@org').then(({id, name}: Organization) => {
        cy.createBucket(id, name, newBucketName)
      })
      cy.writeData(
        [
          `test,container_name=cool dopeness=12 ${now - 1000}000000`,
          `test,container_name=beans dopeness=18 ${now - 1200}000000`,
          `test,container_name=cool dopeness=14 ${now - 1400}000000`,
          `test,container_name=beans dopeness=10 ${now - 1600}000000`,
        ],
        newBucketName
      )

      const flowName = 'Flowbooks'

      cy.getByTestID('preset-new')
        .first()
        .click()
      cy.getByTestID('time-machine-submit-button').should('be.visible')

      cy.getByTestID('page-title').click()
      cy.getByTestID('renamable-page-title--input').type(`${flowName}`)

      // select our bucket, measurement, field and tag
      cy.getByTestID('sidebar-button')
        .first()
        .click()
      cy.getByTestID('Delete--list-item').click()

      cy.getByTestID('panel-add-btn--1').click()
      cy.getByTestID('add-flow-btn--queryBuilder').click()
      cy.getByTestID('bucket-selector').within(() => {
        cy.getByTestID(`selector-list ${newBucketName}`).click()
      })

      // select measurement and field
      cy.getByTestID('builder-card')
        .eq(0)
        .within(() => {
          cy.getByTestID(`selector-list test`).click()
        })
      cy.getByTestID('builder-card')
        .eq(1)
        .within(() => {
          cy.getByTestID(`selector-list dopeness`).click()
        })
      // select beans tag and click preview
      cy.getByTestID('builder-card')
        .eq(2)
        .within(() => {
          cy.getByTestID(`selector-list beans`).click()
        })

      // add an alert cell
      cy.getByTestID('panel-add-btn-2').click()
      cy.getByTestID('add-flow-btn--notification').click()
      cy.getByTestID('time-machine-submit-button').click()
      cy.getByTestID('notification-exp-button').scrollIntoView()
      cy.getByTestID('text-editor').should('be.visible')

      // open exp sidebar panel
      cy.getByTestID('notification-exp-button').should('be.visible')
      cy.getByTestID('notification-exp-button').click()
      cy.getByTestID('flux-toolbar--list').should('be.visible')

      // check that all expressions are listed
      cy.getByTestID('fields-dopeness').should('be.visible')
      cy.getByTestID('tags-container_name').should('be.visible')
      cy.getByTestID('columns-_start').should('be.visible')
      cy.getByTestID('system-_source_measurement')
        .scrollIntoView()
        .should('be.visible')

      // filter for dopeness
      cy.getByTestID('flux-toolbar-search--input').type('dopeness')
      cy.getByTestID('flux--fields-dopeness--inject').click({force: true})
      cy.getByTestID('flux-toolbar-search--input').clear()
      // filter for notebook
      cy.getByTestID('flux-toolbar-search--input').type('notebook')
      cy.getByTestID('flux--system-_notebook_link--inject').click({force: true})

      // make sure message contains injected expressions
      cy.getByTestID('notification-message--monaco-editor').contains(
        'r.dopeness'
      )
      cy.getByTestID('notification-message--monaco-editor').contains(
        'r._notebook_link'
      )

      // make sure task export contains notebook link
      cy.getByTestID('task-form-save').click()
      cy.getByTestID('overlay--body').should('be.visible')
      cy.getByTestID('flux-editor').should('exist')
      cy.getByTestID('form--footer').scrollIntoView()
      cy.getByTestID('overlay--body').within(() => {
        cy.url().then(url => {
          cy.getByTestID('flux-editor').contains(
            `|> set(key: "_notebook_link", value: "${url}")`
          )
        })
      })
    })
  })
})
