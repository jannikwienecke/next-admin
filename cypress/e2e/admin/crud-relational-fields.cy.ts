/// <reference types="cypress" />

import { AdminPage } from "../../utils/POM/adminPom";

const adminPage = new AdminPage();

describe("crud on relational fields for itask", () => {
  before(() => {
    cy.seed();
  });

  beforeEach(() => {
    adminPage.goTo({ view: "task" });
  });

  it("can select relational fields", () => {
    adminPage.openCreate({
      view: "task",
    });
    adminPage.fillTextInput({ placeholder: /enter title/i, value: "NewTask" });
    adminPage.fillTextInput({
      placeholder: /enter description/i,
      value: "NewTaskDescription",
    });

    adminPage.selectRelationalField({
      placeholder: /select iproject/i,
      value: /project 1/i,
    });

    adminPage.selectRelationalField({
      placeholder: /select istatus/i,
      value: /to do/i,
    });

    adminPage.closeForm();

    adminPage.openCreate({
      view: "task",
    });

    expect(cy.findByPlaceholderText(/select iproject/i).should("not.exist"));

    expect(cy.findByPlaceholderText(/select istatus/i).should("not.exist"));

    adminPage.saveForm();

    adminPage.expectFormToBeClosed();

    // expect new task to be in the list
    cy.contains(/newtask/i);
    cy.contains(/newtaskdescription/i);
    cy.contains(/project 1/i);
    cy.contains(/to do/i);
  });

  it('can create a new relational value for "istatus"', () => {
    adminPage.openCreate({
      view: "task",
    });
    adminPage.fillTextInput({ placeholder: /enter title/i, value: "NewTask" });
    adminPage.fillTextInput({
      placeholder: /enter description/i,
      value: "NewTaskDescription",
    });

    cy.contains(/select istatus/i).click();
    cy.findByPlaceholderText(/search item/i).type("NewStatus");
    cy.findByText(/add new/i).click();

    cy.findByText(/create istatus/i);

    cy.findByDisplayValue(/newstatus/i).should("exist");

    adminPage.closeForm();

    cy.contains(/select istatus/i).click();
    cy.findByPlaceholderText(/search item/i).type("NewStatus");
    cy.findByText(/add new/i).click();

    adminPage.saveForm();

    cy.contains(/select iproject/i).click();
    cy.findByPlaceholderText(/search item/i)
      .parent()
      .parent()
      .within(() => {
        cy.findByText(/project 1/i).click();
      });

    cy.contains(/newStatus/i);
    adminPage.saveForm();
    adminPage.expectFormToBeClosed();

    cy.contains(/newStatus/i);
    cy.contains(/newtask/i);
  });
});
