/// <reference types="cypress" />

import { clientConfig } from "../../config";

const sampleConfig = clientConfig.iProject;

describe("basic crud operations", () => {
  before(() => {
    cy.seed();
  });

  beforeEach(() => {
    cy.visit("/?view=iproject");
  });

  it("can read element", () => {
    cy.get("nav").find("li").should("have.have.length.greaterThan", 0);
    cy.get("table").find("tr").should("have.have.length.greaterThan", 1);
  });

  it("can add element", () => {
    // click create
    cy.contains(/create/i).click();
    // see the label create projects
    cy.contains(/create projects/i);

    // see placeholder enter name
    // type NewProject into input field with placeholder "Enter name"
    // cy.get("input[placeholder='Enter name']").type("NewProject");
    cy.findByPlaceholderText(/enter name/i)
      .should("exist")
      .type("NewProject");

    // see placeholder enter description
    // type NewProject into input field with placeholder "Enter description"
    cy.findByPlaceholderText(/enter description/i)
      .should("exist")
      .type("NewProjectDescription");

    // should be persisted
    // click cancel
    cy.findByText(/cancel/i).click();
    // open again
    cy.contains(/create/i).click();

    // see the inputs we typed
    cy.findByPlaceholderText(/enter name/i).should("have.value", "NewProject");
    cy.findByPlaceholderText(/enter description/i).should(
      "have.value",
      "NewProjectDescription"
    );

    // click save
    cy.findByText(/save/i).click();

    // expect to see the new project in the list
    // first make sure we dont see the create button
    cy.contains(/save/i).should("not.exist");
    cy.contains(/newproject/i);
  });

  it("can edit element", () => {
    // find tr with text project
    cy.get("tr")
      .contains(/open menu/i)
      .click();

    cy.findByText(/edit/i).click();

    // expect to see a input field with value containing project
    cy.findByPlaceholderText("Enter Name").clear().type("NewProject");
    cy.findByPlaceholderText("Enter Description")
      .clear()
      .type("NewProjectDescription");

    // click save changes
    cy.findByText(/save changes/i).click();
    cy.findByText(/save changes/i).should("not.exist");

    cy.contains(/newproject/i);
    cy.contains(/newprojectdescription/i);
  });

  it("can delete element", () => {
    cy.get("tr").then((tr) => {
      const length = Cypress.$(tr).length;

      cy.wrap(tr)
        .contains(/open menu/i)
        .click();

      cy.findByText(/delete/i).click();

      cy.findByText(/delete/i).should("not.exist");
      cy.get("tr").should("have.have.length", length - 1);
    });
  });

  // special cases
  it("special:create:required fields", () => {
    cy.createProject({
      name: "",
      description: "NewProjectDescription",
    });

    cy.findByText(/is required/i).should("exist");
  });
});
