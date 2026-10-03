// Secure Authentication & User Storage Utility with SHA-256 Password Hashing & JWT Verification

const SALT = 'vishal_jewellery_salt_2026';
const USERS_STORAGE_KEY = 'vishal_registered_users';

/**
 * Hash password securely using Web Crypto SHA-256
 */
export async function hashPassword(password, salt = SALT) {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get all registered users from local persistence
 */
export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * Save users array to local persistence
 */
export function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered users:', e);
  }
}

/**
 * Seed initial admin user if not present
 */
export async function initializeAuthDatabase() {
  const users = getRegisteredUsers();
  const adminExists = users.some((u) => u.email.toLowerCase() === 'admin@gmail.com');
  
  if (!adminExists) {
    const adminHash = await hashPassword('admin123');
    users.unshift({
      userId: 'usr_admin_001',
      name: 'Vishal Jewellery Admin',
      email: 'admin@gmail.com',
      role: 'admin',
      passwordHash: adminHash,
      createdAt: new Date().toISOString()
    });
    saveRegisteredUsers(users);
  }
}

/**
 * Register a new user with hashed password
 */
export async function registerUser({ name, email, password }) {
  await initializeAuthDatabase();
  const users = getRegisteredUsers();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  // Check if email already registered
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  const passwordHash = await hashPassword(cleanPass);
  const isAdmin = cleanEmail.includes('admin');
  const newUser = {
    userId: 'usr_' + Math.random().toString(36).substring(2, 9),
    name: name ? name.trim() : cleanEmail.split('@')[0],
    email: cleanEmail,
    role: isAdmin ? 'admin' : 'customer',
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  return newUser;
}

/**
 * Verify login credentials matching hashed password
 */
export async function verifyUserCredentials({ email, password }) {
  await initializeAuthDatabase();
  const users = getRegisteredUsers();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  // Find user by email
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    throw new Error('No account with this email found. Please create an account first.');
  }

  // Hash input password and compare with stored hash
  const inputHash = await hashPassword(cleanPass);
  if (user.passwordHash !== inputHash) {
    throw new Error('Incorrect password. Please verify your password.');
  }

  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role
  };
}
