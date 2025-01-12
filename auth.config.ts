import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { getUserByEmail } from '@/auth'; // Update to your user-fetching logic

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: '/login', // Path to your login page
    error: '/login',  // Optional error page path (same as signIn for simplicity)
    signOut: '/logout', // Optional signout page
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Missing credentials');
        }

        const { email, password } = credentials;

        try {
          // Fetch user from the database or external service
          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            throw new Error('Invalid email or password');
          }

          // Compare hashed passwords
          const isPasswordCorrect = await bcrypt.compare(password, user.password);
          if (!isPasswordCorrect) {
            throw new Error('Invalid email or password');
          }

          // Return user object to be serialized into the session
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Include roles if applicable
          };
        } catch (error) {
          console.error('Authorization error:', error.message);
          throw new Error('Invalid email or password');
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log('User signed in:', user);
      return true; // Allow sign-in
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token });

      // Attach user information from token to session
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      console.log('JWT callback:', { token, user });

      // Attach user data to the JWT token during sign-in
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Include role or permissions if applicable
        };
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl });

      // Redirect to the dashboard after login or retain the intended URL
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your `.env` file
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for sessions
    maxAge: 24 * 60 * 60, // Set session duration (e.g., 24 hours)
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your `.env` file
    encryption: true, // Enable encryption for JWTs
  },
};
