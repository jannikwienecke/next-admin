/// <reference types="cypress" />

import { AdminPage } from "../../../cypress/utils/POM/adminPom";
import { clientConfig } from "../../config";

const projectConfig = clientConfig.iProject;

const adminPage = new AdminPage();

describe("view control", () => {
  beforeEach(() => {
    cy.visit("/");
    // cy.seed();
  });

  it('can sort by "desc" and "asc" for normal fields', () => {
    adminPage.tableOrderBy({
      orderBy: /title/i,
      by: "desc",
    });

    adminPage
      .getFirstRow()
      .contains(/builduing a new house/i)
      .should("not.exist");

    adminPage.getFirstRow().contains(/train/i).should("exist");

    // // sort by asc
    adminPage.tableOrderBy({
      orderBy: /title/i,
      by: "asc",
    });

    adminPage.getFirstRow().contains(/buy food/i);
    adminPage.getFirstRow().contains(/train/i).should("not.exist");
    // adminPage
    //   .getFirstRow()
    //   .contains(/Win Mr Olympia/i)
    //   .should("not.exist");
  });

  it('can sort by "desc" and "asc" for relational fields', () => {
    adminPage.tableOrderBy({
      orderBy: /iproject/i,
      by: "desc",
    });

    adminPage.getFirstRow().contains(/Win Mr Olympia/i);

    cy.wait(300);
    // sort by asc
    adminPage.tableOrderBy({
      orderBy: /iproject/i,
      by: "asc",
    });

    adminPage
      .getFirstRow()
      .contains(/Win Mr Olympia/i)
      .should("not.exist");

    adminPage.getFirstRow().contains(/builduing/i);
  });

  it("can hide and show fields", () => {
    cy.findByText(/title/i).click();
    cy.findByText(/hide/i).click();

    cy.findByText(/title/i).should("not.exist");

    cy.findByText(/view/i).click();

    cy.findByRole("menuitemcheckbox", {
      name: /title/i,
    })
      .parent()
      .within(() => {
        cy.get('[aria-checked="false"]').click();
      });

    cy.findByText(/title/i).should("exist");
  });
});
