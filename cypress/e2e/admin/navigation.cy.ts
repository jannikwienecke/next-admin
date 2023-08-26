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

  it("displays two todo items by default", () => {
    // expect to have search params 'view'
    cy.url().should("include", "view");

    // expect to have <nav> <li> elements
    cy.get("nav").find("li").should("have.have.length.greaterThan", 0);

    cy.contains(projectConfig.label).click();
    cy.url().should("include", projectConfig.name);

    // expect(cy.url()).to.include(sampleConfig.name);
  });

  it.only("can jump to relational command bar detail page", () => {
    cy.contains(/builduing a new home/i).click();

    adminPage
      .getCommandbar()
      .contains(/builduing a new home/i)
      .click();

    adminPage.getCommandbar().contains(/desc/i);

    adminPage.goBackCommandbar();

    adminPage
      .getCommandbar()
      .contains(/builduing a new home/i)
      .should("not.exist");
  });
});
