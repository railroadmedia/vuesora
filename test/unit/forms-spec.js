const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-dom'));

import Forms from "/app/vuesora/src/assets/js/forms";
import { JSDOM } from 'jsdom';

let form,
    textInput,
    emailInput,
    passwordInput;

// Create a mock Form element and add inputs to it before every test
beforeEach(() => {
    const dom = new JSDOM(
        `<form id="testForm">
                <input id="textInput" type="text">
                <input id="emailInput" type="email">
                <input id="passwordInput" type="password">
            </form>`,
        { includeNodeLocations: true }
    );
    const document = dom.window.document;
    const formElement = document.getElementById('testForm');

    textInput = document.getElementById('textInput');
    emailInput = document.getElementById('emailInput');
    passwordInput = document.getElementById('passwordInput');

    // console.log(document.querySelectorAll('input'));

    // Instantiate the class
    form = new Forms(formElement);
});

describe('forms', () => {

    it('should exist', function() {
        expect(form).to.not.be.undefined;
    });

    it('should mount to a form with the ID \'testForm\'', function() {
        expect(form.formElement.id).to.equal('testForm');
    });

    // it('input should add class to itself on change', function() {
    //     const changeEvent = new Event('Change');
    //
    //     textInput.setAttribute('value', 'test input');
    //     textInput.dispatchEvent(changeEvent);
    //
    //     emailInput.setAttribute('value', 'test@input.com');
    //     emailInput.dispatchEvent(changeEvent);
    //
    //     passwordInput.setAttribute('value', 'testpassword');
    //     passwordInput.dispatchEvent(changeEvent);
    //
    //     expect(textInput).to.have.class('has-input');
    //     expect(emailInput).to.have.class('has-input');
    //     expect(passwordInput).to.have.class('has-input');
    // });
});
