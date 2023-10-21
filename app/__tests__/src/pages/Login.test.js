import React from "react";
import renderer from 'react-test-renderer';
import { MemoryRouter } from "react-router-dom"; 
import { describe, it, expect } from '@jest/globals';
import Login from '../../../src/pages/Login';
import axios from 'axios';
import MockAdapter from'axios-mock-adapter';
import AuthServices from '../../../src/services/auth.services'

jest.useFakeTimers();

describe("Login Component", () => {

it("can render login page without errors", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    )});

    expect(component.toJSON()).toMatchSnapshot();
});

it("can navigate to the welcome page and the signup pages", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    )});

    const entrarButton = component.root.findAllByProps({ to: "/welcome" })[1];
    const submitButton = component.root.findByProps({ to: "/signup" });

    expect(entrarButton && submitButton).toBeTruthy();
    });

  it("can submit a correct HTTP request", async () => {
    let component;
    await renderer.act(async () => {
        component = renderer.create(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    )});

    const mockAxios = new MockAdapter(axios);

    mockAxios.onPost('http://127.0.0.1:8888/api/credentials/login').reply(202);

    const formData = {
        email: "mail@HotMail.com",
        password: "wordOfPass",
      };

    AuthServices.postUserLogin({ formData });

    expect(mockAxios.history.post.length).toBe(1); 
  });
});