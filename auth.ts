import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import type { User } from '@/app/lib/definitions';

// Helper function to fetch a user by email
async function getUser(email: string): Promise<User | null> {
  try {
    const { rows } = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
    return rows[0] || null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export default NextAuth({
  ...authConfig, // Extending the `authConfig` with additional logic
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate incoming credentials structure
        const parsedCredentials = z
          .object({
            email: z.string().email('Invalid email address'),
            password: z.string().min(6, 'Password must be at least 6 characters long'),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.error('Invalid credentials:', parsedCredentials.error.errors);
          throw new Error('Invalid email or password');
        }

        const { email, password } = parsedCredentials.data;

        // Fetch the user from the database
        const user = await getUser(email);
        if (!user) {
          console.error('User not found for email:', email);
          throw new Error('Invalid email or password');
        }

        // Verify the password
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          console.error('Incorrect password for email:', email);
          throw new Error('Invalid email or password');
        }

        // Return user object to be serialized into the session
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Include user roles if applicable
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Use JWT for session management
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = token.user as User;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Attach user information to the token
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your `.env` file
});
