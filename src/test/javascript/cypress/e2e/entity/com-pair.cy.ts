import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('ComPair e2e test', () => {
  const comPairPageUrl = '/com-pair';
  const comPairPageUrlPattern = new RegExp('/com-pair(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const comPairSample = {};

  let comPair;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/com-pairs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/com-pairs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/com-pairs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (comPair) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/com-pairs/${comPair.id}`,
      }).then(() => {
        comPair = undefined;
      });
    }
  });

  it('ComPairs menu should load ComPairs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('com-pair');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ComPair').should('exist');
    cy.url().should('match', comPairPageUrlPattern);
  });

  describe('ComPair page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(comPairPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ComPair page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/com-pair/new$'));
        cy.getEntityCreateUpdateHeading('ComPair');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', comPairPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/com-pairs',
          body: comPairSample,
        }).then(({ body }) => {
          comPair = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/com-pairs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [comPair],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(comPairPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ComPair page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('comPair');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', comPairPageUrlPattern);
      });

      it('edit button click should load edit ComPair page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ComPair');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', comPairPageUrlPattern);
      });

      it('edit button click should load edit ComPair page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ComPair');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', comPairPageUrlPattern);
      });

      it('last delete button click should delete instance of ComPair', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('comPair').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', comPairPageUrlPattern);

        comPair = undefined;
      });
    });
  });

  describe('new ComPair page', () => {
    beforeEach(() => {
      cy.visit(`${comPairPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ComPair');
    });

    it('should create an instance of ComPair', () => {
      cy.get(`[data-cy="requestId"]`).type('80689').should('have.value', '80689');

      cy.get(`[data-cy="requestIdx"]`).type('78551').should('have.value', '78551');

      cy.get(`[data-cy="system1"]`).type('override envisioneer overriding').should('have.value', 'override envisioneer overriding');

      cy.get(`[data-cy="system2"]`).type('orchestrate').should('have.value', 'orchestrate');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        comPair = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', comPairPageUrlPattern);
    });
  });
});
