export interface UserAccount {
  userId: string;
  email: string;
  password: string;
  fullName: string;
  countryCode: string;
  createdAt: string;
}

export interface UserAuthSession {
  userId: string;
  email?: string;
  fullName?: string;
  countryCode: string;
  isLoggedIn: boolean;
  loginTimestamp?: string;
  savedAddress?: string;
}

const ACCOUNTS_STORAGE_KEY = 'zyro_registered_accounts';
const SESSION_STORAGE_KEY = 'zyro_auth_session';

// Pre-seeded starter athlete accounts for testing and instant access
const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    userId: 'Hunter_Balaji',
    email: 'balaji@vylo.fit',
    password: 'Ascend2026!',
    fullName: 'Balaji Hunter',
    countryCode: 'IN',
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    userId: 'athlete_alex',
    email: 'alex@vylo.fit',
    password: 'Password123!',
    fullName: 'Alex Rivera',
    countryCode: 'US',
    createdAt: '2026-02-10T12:00:00.000Z',
  },
  {
    userId: 'hunter_sarah',
    email: 'sarah@vylo.fit',
    password: 'Sprint2026!',
    fullName: 'Sarah Jenkins',
    countryCode: 'GB',
    createdAt: '2026-02-20T14:30:00.000Z',
  },
  {
    userId: 'athlete_kenji',
    email: 'kenji@vylo.fit',
    password: 'Tokyo2026!',
    fullName: 'Kenji Sato',
    countryCode: 'JP',
    createdAt: '2026-03-01T09:15:00.000Z',
  },
];

export const getStoredAccounts = (): UserAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse stored accounts:', err);
  }

  // Initialize with default accounts
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
  } catch (err) {
    console.error('Failed to save default accounts:', err);
  }
  return DEFAULT_ACCOUNTS;
};

export const saveAccounts = (accounts: UserAccount[]): void => {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to persist accounts:', err);
  }
};

export const findAccountByIdentifier = (identifier: string): UserAccount | undefined => {
  const accounts = getStoredAccounts();
  const cleanId = (identifier || '').trim().toLowerCase();
  return accounts.find(
    (acc) =>
      acc.userId.toLowerCase() === cleanId ||
      acc.email.toLowerCase() === cleanId
  );
};

export const validateLogin = (
  identifier: string,
  passwordAttempt: string
): { success: boolean; account?: UserAccount; error?: string } => {
  const cleanId = (identifier || '').trim();
  if (!cleanId) {
    return { success: false, error: 'Please enter your User ID or Email.' };
  }
  if (!passwordAttempt) {
    return { success: false, error: 'Please enter your password.' };
  }

  const account = findAccountByIdentifier(cleanId);
  if (!account) {
    return {
      success: false,
      error: `No account found with identifier "${cleanId}". Please check your details or create a new account.`,
    };
  }

  if (account.password !== passwordAttempt) {
    return {
      success: false,
      error: 'Incorrect password. If you forgot your password, click "Forgot Password?" below to reset it.',
    };
  }

  return { success: true, account };
};

export const registerAccount = (
  newAccount: Omit<UserAccount, 'createdAt'>
): { success: boolean; account?: UserAccount; error?: string } => {
  const cleanId = (newAccount.userId || '').trim();
  const cleanEmail = (newAccount.email || '').trim().toLowerCase();

  if (!cleanId || cleanId.length < 3) {
    return { success: false, error: 'User ID must be at least 3 characters long.' };
  }

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  if (!newAccount.password || newAccount.password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long.' };
  }

  const accounts = getStoredAccounts();
  const existingUserId = accounts.find((a) => a.userId.toLowerCase() === cleanId.toLowerCase());
  if (existingUserId) {
    return {
      success: false,
      error: `User ID "${cleanId}" is already taken. Please choose another or sign in.`,
    };
  }

  const existingEmail = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (existingEmail) {
    return {
      success: false,
      error: `An account with email "${cleanEmail}" already exists. Please sign in or reset your password.`,
    };
  }

  const account: UserAccount = {
    userId: cleanId,
    email: cleanEmail,
    password: newAccount.password,
    fullName: (newAccount.fullName || cleanId).trim(),
    countryCode: newAccount.countryCode || 'IN',
    createdAt: new Date().toISOString(),
  };

  accounts.push(account);
  saveAccounts(accounts);

  return { success: true, account };
};

export const resetPassword = (
  identifier: string,
  newPassword: string
): { success: boolean; account?: UserAccount; error?: string } => {
  const cleanId = (identifier || '').trim();
  if (!cleanId) {
    return { success: false, error: 'Please enter your User ID or Email.' };
  }

  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: 'New password must be at least 4 characters long.' };
  }

  const accounts = getStoredAccounts();
  const targetIndex = accounts.findIndex(
    (acc) =>
      acc.userId.toLowerCase() === cleanId.toLowerCase() ||
      acc.email.toLowerCase() === cleanId.toLowerCase()
  );

  if (targetIndex === -1) {
    return {
      success: false,
      error: `No existing account found with User ID or Email "${cleanId}". Please check your details or create a new account.`,
    };
  }

  accounts[targetIndex].password = newPassword;
  saveAccounts(accounts);

  return { success: true, account: accounts[targetIndex] };
};

export const saveAuthSession = (session: UserAuthSession): void => {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session:', err);
  }
};

export const getAuthSession = (): UserAuthSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.isLoggedIn) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse session:', err);
  }
  return null;
};

export const clearAuthSession = (): void => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
};
