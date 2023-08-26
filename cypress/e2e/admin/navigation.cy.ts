/// <reference types="cypress" />

import { AdminPage } from "../../../cypress/utils/POM/adminPom";
import { clientConfig } from "../../config";

const projectConfig = clientConfig.iProject;

const adminPage = new AdminPage();

describe("base navigation testing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.seed();
  });

  it("can navigate with the sidebar", () => {
    // expect to have search params 'view'
    cy.url().should("include", "view");

    // expect to have <nav> <li> elements
    cy.get("nav").find("li").should("have.have.length.greaterThan", 0);

    cy.contains(projectConfig.label).click();
    cy.url().should("include", projectConfig.name);

    // there was a bug where clicking the same link
    // clicking again should do nothing
    cy.contains(projectConfig.label).click();

    cy.wait(1000);
    cy.contains(/loading/i).should("not.exist");
  });

  it("can jump to relational command bar detail page", () => {
    cy.contains(/builduing a new house/i).click();

    adminPage
      .getCommandbar()
      .contains(/builduing a new house/i)
      .click();

    adminPage.getCommandbar().contains(/desc/i);

    adminPage.goBackCommandbar();

    adminPage
      .getCommandbar()
      .contains(/builduing a new house/i)
      .should("not.exist");
  });
});
