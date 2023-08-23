/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("seed", () => {
  cy.exec("npm run seed:testing");
});

Cypress.Commands.add("createProject", ({ description, name }) => {
  cy.wait(1000);
  cy.contains(/create/i).click({ force: true });

  cy.contains(/create projects/i);

  name &&
    cy
      .findByPlaceholderText(/enter name/i)
      .should("exist")
      .type(name);

  // see placeholder enter description
  // type NewProject into input field with placeholder "Enter description"
  cy.findByPlaceholderText(/enter description/i)
    .should("exist")
    .type(description);

  cy.findByText(/save/i).click();

  cy.contains(/save/i).should("not.exist");
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      seed(): Chainable<void>;
      createProject(options: {
        name: string;
        description: string;
      }): Chainable<void>;
    }
  }
}

// Prevent TypeScript from reading file as legacy script
import "@testing-library/cypress/add-commands";

export {};
