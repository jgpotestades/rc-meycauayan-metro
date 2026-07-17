// app/actions/auth.ts
'use server';

export async function verifyCredentials(formData: FormData) {
  const usernameInput = formData.get('username') as string;
  const passwordInput = formData.get('password') as string;

  const systemUsername = process.env.ADMIN_USERNAME;
  const systemPassword = process.env.ADMIN_PASSWORD;

  if (!systemUsername || !systemPassword) {
    return { success: false, error: 'Server configuration error.' };
  }

  // Verification happens strictly on the server side
  if (usernameInput === systemUsername && passwordInput === systemPassword) {
    return { success: true };
  }

  return { success: false, error: 'Invalid security credentials.' };
}