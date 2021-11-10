import { Organization } from '@influxdata/influx'
import { orgs } from 'mocks/dummyData'
import {Organization} from '../../../src/types'

const DashName = 'happy Dashboard'
const LabelName = 'bark'
describe('Dashboards', () => {
  beforeEach(() =>
    cy.flush().then(() =>
      cy.signin().then(() =>
        cy.fixture('routes').then(({orgs}) => {
          cy.get<Organization>('@org').then(({id}: Organization) => {
            cy.visit(`${orgs}/${id}/dashboards-list`)
            cy.request(`${orgs}/${id}/dashboards-list`)
            cy.getByTestID('tree-nav')
            /* cy.exec('rm cypress/downloads/*', {
              log: true,
              failOnNonZeroExit: false,
            }) */
          })
        })
      )
    )
  )
 /* it(' create dash', () => {
    cy.get<Organization>('@org')
        .then(({id}:Organization) =>
        cy.createDashboard(id, DashName)
          .then(({body}) => 
          cy.createAndAddLabel('dashboards', id, body.id, LabelName)
            .then(() => 
            cy.createCell(body.id).then(cellResp => {
              const dbID = body.id
              const orgID = orgs
              const cellID = cellResp.body.id
              cy.createView(dbID, cellID)
              cy.wrap({orgID, dbID, cellID}).as('resourceIDs')
              cy.fixture('routes')
                .then(({orgs}) => 
                  cy.get<Organization>('@org')
                    .then(({id}: Organization) => {
                    cy.visit(`${orgs}/${id}/dashboards-list`)
                      return cy.getByTestID('tree-nav')
                }) 
              )
            })
          )
        )
      )
      cy.getByTestID('context-menu-dashboard').click({force: true}).then(() => 
        cy.getByTestID('context-clone-dashboard').click({force: true})).then(() => 
          cy.wrap('page-title').should('eq', `${DashName} (clone 1)`))
      .wait(200)
    //  cy.getByTestID('nav-item-dashboards').click().then(() => 
      //  cy.getByTestID(`label--pill ${LabelName}`).should('have.length', 2))
      cy.wrap('page-title').should('eq', `${DashName} (clone 1)`)
      cy.getByTestID('collapsible_menu').then(() => 
        cy.getByTestID('select-group--option').should('be.checked'))

      cy.getByTestID('page-title').then(($a) => {
        if ($a.text().includes(`${DashName} (clone 1)`)){
          cy.getByTestID('nav-item-dashboards').click()
            .wait(500)
            .then(() => 
              cy.getByTestID(`label--pill ${LabelName}`).should('have.length.greaterThan', 1)
            )
        }
        else {
          cy.getByTestID(`label--pill ${LabelName}`).should('have.length.greaterThan', 1)
        }
      })
    })  */

  // creating testing dashboard with label and empty cell to clone
  describe('Create dashboard', () => {
    beforeEach(() => 
      cy.get<Organization>('@org')
        .then(({id}:Organization) =>
        cy.createDashboard(id, DashName)
          .then(({body}) => 
          cy.createAndAddLabel('dashboards', id, body.id, LabelName)
            .then(() => 
            cy.createCell(body.id)
              .then(() => 
              cy.fixture('routes')
                .then(({orgs}) => 
                cy.get<Organization>('@org')
                  .then(({id}: Organization) => {
                  cy.visit(`${orgs}/${id}/dashboards-list`)
                  return cy.getByTestID('tree-nav')
                })
              )
            )
          )
        )
      )
    )
    // eslint-disable-next-line jest/no-focused-tests
    it.only('clone label', () => {
      cy.getByTestID('context-menu-dashboard').then(() => 
        cy.getByTestID('context-clone-dashboard').click()
      )

      // checking if new clone dashboard is existing
      cy.getByTestID('clone-dashboard').first().click({force: true}).then(() => 
      cy.wrap('page-title').contains('happy Dashboard (clone 1)'))
        // cy.wrap('page-title').contains(`${DashName} (clone 1)`))
      .wait(200)
    //  cy.getByTestID('nav-item-dashboards').click().then(() => 
      //  cy.getByTestID(`label--pill ${LabelName}`).should('have.length', 2))
      cy.wrap('page-title').should('eq', `${DashName} (clone 1)`)
      cy.getByTestID('collapsible_menu').then(() => 
        cy.getByTestID('select-group--option').should('be.checked'))


      // checing whether labels are also clone
      cy.getByTestID('page-title').then(($a) => {
        if ($a.text().includes(`${DashName} (clone 1)`)){
          cy.getByTestID('nav-item-dashboards').click()
            .wait(500)
            .then(() => 
              cy.getByTestID(`label--pill ${LabelName}`).should('have.length.greaterThan', 1)
            )
        }
        else {
          cy.getByTestID(`label--pill ${LabelName}`).should('have.length.greaterThan', 1)
        }
      })
    })
    it('checking clone graph', () => {
      cy.getByTestID('context-menu-dashboard').click({force: true}).then(() => 
        cy.getByTestID('context-clone-dashboard').click({force: true}))
      cy.wrap('page-title').should('eq', `${DashName} (clone 1)`)
    })
  })
  // eslint-disable-next-line jest/no-focused-tests
  it('load page', () => {
    cy.getByTestID('user-nav').click()
  })
})
