/// <reference types="cypress" />

import { AdminPage } from "../../utils/POM/adminPom";

const adminPage = new AdminPage();

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
    adminPage.openCreate({
      view: "iProject",
    });

    adminPage.fillTextInput({
      placeholder: /enter name/i,
      value: "NewProject",
    });

    adminPage.fillTextInput({
      placeholder: /enter description/i,
      value: "NewProjectDescription",
    });

    adminPage.closeForm();

    adminPage.openCreate({
      view: "iProject",
    });

    // see the inputs we typed
    cy.findByPlaceholderText(/enter name/i).should("have.value", "NewProject");
    cy.findByPlaceholderText(/enter description/i).should(
      "have.value",
      "NewProjectDescription"
    );

    adminPage.saveForm();

    adminPage.expectFormToBeClosed();

    cy.contains(/newproject/i);
  });

  it("can edit element", () => {
    // find tr with text project
    cy.get("tr")
      .contains(/open menu/i)
      .click();

    cy.findByText(/edit/i).click();

    adminPage.editTextInput({
      placeholder: /enter name/i,
      value: "NewProject",
    });

    adminPage.editTextInput({
      placeholder: /enter description/i,
      value: "NewProjectDescription",
    });

    adminPage.saveForm();
    adminPage.expectFormToBeClosed();

    cy.contains(/newproject/i);
    cy.contains(/newprojectdescription/i);
  });

  it("can delete element", () => {
    adminPage.getRow().then((tr) => {
      const length = Cypress.$(tr).length;

      adminPage.openRowContextMenu({
        tr,
      });

      cy.findByText(/delete/i).click();

      cy.findByText(/delete/i).should("not.exist");
      cy.get("tr").should("have.have.length", length - 1);
    });
  });

  // special cases
  it("special:create:required fields", () => {
    adminPage.openCreate({
      view: "iProject",
    });

    adminPage.fillTextInput({
      placeholder: /enter desc/i,
      value: "NewProjectDescription",
    });

    cy.findByText(/name is required/i).should("not.exist");

    adminPage.saveForm();

    cy.findByText(/name is required/i).should("exist");

    adminPage.fillTextInput({
      placeholder: /enter name/i,
      value: "NewProject",
    });

    cy.findByText(/name is required/i).should("not.exist");
  });
});
