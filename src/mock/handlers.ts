import { rest } from 'msw';

export const handlers = [
    rest.post('http://localhost:8080/api/auth/login', (req, res, ctx) => {
        const { username, password } = req.body as { username: string; password: string };
        if (username === 'testuser' && password === 'password') {
            return res(
                ctx.status(200),
                ctx.json({ token: 'fake-token' })
            );
        } else {
            return res(
                ctx.status(401),
                ctx.json({ message: 'Invalid credentials' })
            );
        }
    }),
];

