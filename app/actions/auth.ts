// app/actions/auth.ts
'use server';

interface UserAccount {
  role: 'Member' | 'Director' | 'Officer' | 'Admin';
  hash: string;
  needsPasswordReset: boolean; // Tracks if the user is still on their temporary password
}

// Simulated database registry. In production, this state would persist in your database.
const USER_REGISTRY: Record<string, UserAccount> = {
  "admin": { role: "Admin", hash: "", needsPasswordReset: false }, // Handled primarily by env variables
  
  // Roster entries initialized with temporary password state set to true
  "arvinjasonandaya": { role: "Officer", hash: "YourTemporarySecurePasswd123!", needsPasswordReset: true },
  "rosemarievalencia": { role: "Officer", hash: "YourTemporarySecurePasswd123!", needsPasswordReset: true },
  "felixdomigpe": { role: "Member", hash: "YourTemporarySecurePasswd123!", needsPasswordReset: true }
};

export async function verifyCredentials(formData: FormData) {
  const usernameInput = (formData.get('username') as string)?.trim().toLowerCase();
  const passwordInput = formData.get('password') as string;

  if (!usernameInput || !passwordInput) {
    return { success: false, error: 'Credentials required.' };
  }

  // 1. Check Primary Admin Environment Overrides
  const systemUsername = process.env.ADMIN_USERNAME || 'admin';
  const systemPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (usernameInput === systemUsername.toLowerCase() && passwordInput === systemPassword) {
    return { 
      success: true, 
      userPayload: { username: systemUsername.toLowerCase(), role: 'Admin', needsReset: false } 
    };
  }

  // 2. Process Roster Accounts
  const targetUser = USER_REGISTRY[usernameInput];
  if (!targetUser) {
    return { success: false, error: 'Invalid security credentials.' };
  }

  // Check against password string (using plain text matching for temporary implementation)
  const match = passwordInput === targetUser.hash; 

  if (!match) {
    return { success: false, error: 'Invalid security credentials.' };
  }

  // Return the flag indicating if the client component needs to trigger a reset modal
  return { 
    success: true, 
    userPayload: { 
      username: usernameInput, 
      role: targetUser.role,
      needsReset: targetUser.needsPasswordReset 
    } 
  };
}

/**
 * Updates the user registry with a new secure password string and clears the reset flag.
 */
export async function updateUserPassword(formData: FormData) {
  const username = (formData.get('username') as string)?.trim().toLowerCase();
  const newPassword = formData.get('password') as string;

  if (!username || !newPassword || newPassword.length < 8) {
    return { success: false, error: 'Valid new password string required (minimum 8 characters).' };
  }

  if (USER_REGISTRY[username]) {
    // In production, run: USER_REGISTRY[username].hash = await bcrypt.hash(newPassword, 10);
    USER_REGISTRY[username].hash = newPassword; 
    USER_REGISTRY[username].needsPasswordReset = false;
    return { success: true };
  }

  return { success: false, error: 'User target lookup failed.' };
}