import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { rest } from "msw";

const authHandlers = [
    // Handler for the authentication endpoint
    rest.post('/api/authenticate', (req, res, ctx) => {
      const mockToken = 'mock-auth-token';
      return res(ctx.status(200), ctx.json({ token: mockToken }));
    }),
    ...handlers,
  ];
  
  const server = setupServer(...authHandlers);

export { server, handlers };
