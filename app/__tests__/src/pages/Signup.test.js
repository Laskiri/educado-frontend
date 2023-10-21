import React from "react";
import renderer from 'react-test-renderer';
import { MemoryRouter } from "react-router-dom"; 
import { describe, it, expect } from '@jest/globals';
import Signup from '../../../src/pages/Signup';
import axios from 'axios';
import MockAdapter from'axios-mock-adapter';
import AuthServices from '../../../src/services/auth.services'

jest.useFakeTimers();

describe("Signup Component", () => {

it("can render signup page without errors", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    )});

    expect(component.toJSON()).toMatchSnapshot();
});

it("can navigate to the welcome page and the login pages", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    )});

    const entrarButton = component.root.findAllByProps({ to: "/welcome" })[1];
    const submitButton = component.root.findByProps({ to: "/login" });

    expect(entrarButton && submitButton).toBeTruthy();
    });

  it("can submit a correct HTTP request", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    )});

    const mockAxios = new MockAdapter(axios);

    mockAxios.onPost('http://127.0.0.1:8888/api/credentials/signup').reply(201);

    const formData = {
        name: "Name",
        email: "mail@HotMail.com",
        password: "wordOfPass",
      };

    AuthServices.postUserSignup({ formData });

    expect(mockAxios.history.post.length).toBe(1); 
  });
});