/// <reference types="cypress" />

import { AdminPage } from "../../utils/POM/adminPom";

const adminPage = new AdminPage();

describe("command bar navigation", () => {
  before(() => {
    cy.seed();
  });

  beforeEach(() => {
    cy.visit("/?view=iproject");
  });

  it("can navigate to detail view and back", () => {
    // click command + k
    adminPage.openCommandbar();

    adminPage.typeCommandbarInput({
      value: "project",
    });

    adminPage.getCommandbar().findByText(/task/i).should("not.exist");
    adminPage
      .getCommandbar()
      .findByText(/project/i)
      .click();

    adminPage
      .getCommandbar()
      .findByText(/project 1/i)
      .should("exist");

    adminPage
      .getCommandbar()
      .findByText(/project 2/i)
      .click();

    adminPage
      .getCommandbar()
      .findByText(/project 1/i)
      .should("not.exist");

    adminPage
      .getCommandbar()
      .findByText(/description/i)
      .should("exist");

    adminPage.getCommandbar().findByText(/created/i);

    adminPage.getCommandbar().findByText(/updated/i);

    adminPage.goBackCommandbar();

    adminPage
      .getCommandbar()
      .findByText(/description/i)
      .should("not.exist");

    adminPage
      .getCommandbar()
      .findByText(/project 1/i)
      .should("exist");

    adminPage.goBackCommandbar();

    adminPage
      .getCommandbar()
      .findByText(/project 1/i)
      .should("not.exist");

    adminPage.getCommandbar().findByText(/tasks/i).should("exist");

    adminPage
      .getCommandbar()
      .findByText(/status/i)
      .should("exist");

    adminPage.goBackCommandbar();

    adminPage.getCommandbar().should("not.exist");
  });

  it("can display relational fields", () => {
    adminPage.openCommandbar();

    adminPage.typeCommandbarInput({
      value: "task",
    });

    adminPage.getCommandbar().findByText(/task/i).click();

    adminPage
      .getCommandbar()
      .findByText(/task 1/i)
      .click();

    adminPage.getCommandbar().contains(/project/i);
    adminPage.getCommandbar().contains(/status/i);
  });
});
