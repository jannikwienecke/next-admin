/// <reference types="cypress" />

import { clientConfig } from "../../config";

const sampleConfig = clientConfig.iProject;

describe("base navigation testing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.task("log", sampleConfig.label);
    // cy.task("seed");
    cy.exec("npm run seed:testing");
  });

  it("displays two todo items by default", () => {
    // expect to have search params 'view'
    cy.url().should("include", "view");

    // expect to have <nav> <li> elements
    cy.get("nav").find("li").should("have.have.length.greaterThan", 0);

    console.log("CLICK ON", sampleConfig.label);

    cy.contains(sampleConfig.label).click();
    cy.url().should("include", sampleConfig.name);

    // expect(cy.url()).to.include(sampleConfig.name);
  });
});
