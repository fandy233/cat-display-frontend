import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'jotai';
import LoginForm from './LoginForm';
import { server } from '../mock/server';
import { rest } from 'msw';
import axios from "axios";

// Set up API mocking
beforeAll(() => {
    axios.defaults.baseURL = 'http://localhost';
    jest.spyOn(window, 'alert').mockImplementation((message) => {
        console.log(message);
    });
    server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders login form and allows input', () => {
    render(
        <Provider>
            <LoginForm />
        </Provider>
    );

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Check if inputs and button are in the document
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    // Check if input values have changed
    expect((usernameInput as HTMLInputElement).value).toBe('testuser');
    expect((passwordInput as HTMLInputElement).value).toBe('password');
});

test('handles successful login', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    server.use(
        rest.post('http://localhost:8080/api/auth/login', (_req, res, ctx) => {
            return res(ctx.status(200), ctx.json({ token: 'fake-token' }));
        })
    );

    render(
        <Provider>
            <LoginForm />
        </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(consoleSpy).toHaveBeenCalledWith('Login successful!');
});

test('handles login failure', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    server.use(
        rest.post('http://localhost:8080/api/auth/login', (_req, res, ctx) => {
            return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
        })
    );

    render(
        <Provider>
            <LoginForm />
        </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(consoleSpy).toHaveBeenCalledWith('Login failed, please try again.');
});