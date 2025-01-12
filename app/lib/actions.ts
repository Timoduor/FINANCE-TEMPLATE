import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

// Sign-in action
export async function signIn(email: string, password: string) {
  try {
    const response = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false, // Prevent automatic redirection
    });

    if (response?.error) {
      console.error('Sign-in error:', response.error);
      throw new Error(`Sign-in failed: ${response.error}`);
    }

    console.log('Sign-in successful:', response);
    revalidatePath('/dashboard'); // Revalidate the dashboard path after sign-in
  } catch (error) {
    console.error('Sign-in failed:', error);
    throw new Error('An error occurred during sign-in.');
  }
}

// Sign-out action
export async function signOut() {
  try {
    await nextAuthSignOut({ redirect: false });
    console.log('Sign-out successful');
    redirect('/login'); // Redirect to the login page after signing out
  } catch (error) {
    console.error('Sign-out failed:', error);
    throw new Error('An error occurred during sign-out.');
  }
}

// Generic revalidation action
export async function revalidate(path: string = '/dashboard') {
  try {
    revalidatePath(path); // Revalidate the given path
    console.log(`Path revalidated successfully: ${path}`);
  } catch (error) {
    console.error(`Revalidation failed for path ${path}:`, error);
    throw new Error('Revalidation failed.');
  }
}
