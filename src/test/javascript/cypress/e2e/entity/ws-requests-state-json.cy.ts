import { entityDetailsBackButtonSelector, entityDetailsButtonSelector, entityTableSelector } from '../../support/entity';

describe('WsRequestsStateJSON e2e test', () => {
  const wsRequestsStateJSONPageUrl = '/ws-requests-state-json';
  const wsRequestsStateJSONPageUrlPattern = new RegExp('/ws-requests-state-json(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const wsRequestsStateJSONSample = {};

  let wsRequestsStateJSON;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ws-requests-state-jsons+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ws-requests-state-jsons').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ws-requests-state-jsons/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (wsRequestsStateJSON) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ws-requests-state-jsons/${wsRequestsStateJSON.id}`,
      }).then(() => {
        wsRequestsStateJSON = undefined;
      });
    }
  });

  it('WsRequestsStateJSONS menu should load WsRequestsStateJSONS page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ws-requests-state-json');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('WsRequestsStateJSON').should('exist');
    cy.url().should('match', wsRequestsStateJSONPageUrlPattern);
  });

  describe('WsRequestsStateJSON page', () => {
    describe('with existing value', () => {
      beforeEach(function () {
        cy.visit(wsRequestsStateJSONPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details WsRequestsStateJSON page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('wsRequestsStateJSON');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', wsRequestsStateJSONPageUrlPattern);
      });
    });
  });
});
