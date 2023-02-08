import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

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
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(wsRequestsStateJSONPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create WsRequestsStateJSON page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ws-requests-state-json/new$'));
        cy.getEntityCreateUpdateHeading('WsRequestsStateJSON');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', wsRequestsStateJSONPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ws-requests-state-jsons',
          body: wsRequestsStateJSONSample,
        }).then(({ body }) => {
          wsRequestsStateJSON = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ws-requests-state-jsons+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [wsRequestsStateJSON],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(wsRequestsStateJSONPageUrl);

        cy.wait('@entitiesRequestInternal');
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

      it('edit button click should load edit WsRequestsStateJSON page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('WsRequestsStateJSON');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', wsRequestsStateJSONPageUrlPattern);
      });

      it('edit button click should load edit WsRequestsStateJSON page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('WsRequestsStateJSON');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', wsRequestsStateJSONPageUrlPattern);
      });

      it('last delete button click should delete instance of WsRequestsStateJSON', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('wsRequestsStateJSON').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', wsRequestsStateJSONPageUrlPattern);

        wsRequestsStateJSON = undefined;
      });
    });
  });

  describe('new WsRequestsStateJSON page', () => {
    beforeEach(() => {
      cy.visit(`${wsRequestsStateJSONPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('WsRequestsStateJSON');
    });

    it('should create an instance of WsRequestsStateJSON', () => {
      cy.get(`[data-cy="requestId"]`).type('4133').should('have.value', '4133');

      cy.get(`[data-cy="index"]`).type('14232').should('have.value', '14232');

      cy.get(`[data-cy="cmdListJson"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="system"]`).type('matrix unleash').should('have.value', 'matrix unleash');

      cy.get(`[data-cy="created"]`).type('2023-02-07T01:15').blur().should('have.value', '2023-02-07T01:15');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        wsRequestsStateJSON = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', wsRequestsStateJSONPageUrlPattern);
    });
  });
});
