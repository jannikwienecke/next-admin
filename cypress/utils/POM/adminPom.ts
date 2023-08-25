import { clientConfig } from "../../../cypress/config";

export class AdminPage {
  constructor() {}

  goTo({ view }: { view: keyof typeof clientConfig }) {
    cy.visit(`/?view=${view}`);
  }

  openCreate({ view }: { view: keyof typeof clientConfig }) {
    const label = clientConfig[view].label;
    cy.contains(/create new/i).click();
    cy.contains(`Create ${label}`).should("exist");
  }

  closeForm() {
    cy.contains(/cancel/i).click();
    cy.findByLabelText(/close/i).should("not.exist");
  }

  saveForm() {
    cy.contains(/save changes/i).click();
  }

  expectFormToBeClosed() {
    cy.contains(/cancel/i).should("not.exist");
  }

  openRowContextMenu({ tr }: { tr: JQuery<HTMLElement> }) {
    cy.wrap(tr)
      .contains(/open menu/i)
      .click();
  }

  getFirstRow() {
    return cy.get("tr");
  }

  fillTextInput({
    placeholder,
    value,
  }: {
    placeholder: string | RegExp;
    value: string;
  }) {
    cy.findByPlaceholderText(placeholder).should("exist").type(value);
  }

  editTextInput({
    placeholder,
    value,
  }: {
    placeholder: string | RegExp;
    value: string;
  }): void {
    cy.findByPlaceholderText(placeholder).clear().type(value);
  }

  selectRelationalField({
    placeholder,
    value,
  }: {
    placeholder: string | RegExp;
    value: string | RegExp;
  }) {
    cy.contains(placeholder).click();
    cy.findByPlaceholderText(/search item/i)
      .parent()
      .parent()
      .within(() => {
        cy.contains(value).click({ force: true });
      });

    cy.findByPlaceholderText(/search item/i).should("not.exist");
  }

  openCommandbar() {
    cy.get("body").trigger("keydown", {
      key: "k",
      metaKey: true,
    });
  }

  goBackCommandbar() {
    this.getCommandbar().trigger("keydown", {
      key: "Escape",
    });
  }

  typeCommandbarInput({ value }: { value: string }) {
    cy.findByPlaceholderText(/type a command/i).type(value);
  }

  // data-cy
  getByTestId({ testId }: { testId: string }) {
    return cy.get(`[data-cy=${testId}]`);
  }

  getCommandbar() {
    return this.getByTestId({ testId: "admin-commandbar" });
  }
}
