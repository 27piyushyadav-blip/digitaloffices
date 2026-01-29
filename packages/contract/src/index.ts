import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

// Define your shared schemas (Zod is already in your stack)
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

// Define the API Contract
export const apiContract = c.router({
  getUsers: {
    method: 'GET',
    path: '/users',
    responses: {
      200: z.array(UserSchema),
    },
    summary: 'Get all users',
  },
});
