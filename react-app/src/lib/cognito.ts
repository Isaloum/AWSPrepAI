/**
 * lib/cognito.ts
 * Cognito auth wrapper — replaces Supabase auth.
 */
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  type CognitoUserSession,
} from 'amazon-cognito-identity-js'

const POOL_ID   = import.meta.env.VITE_COGNITO_USER_POOL_ID as string
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID as string

if (!POOL_ID || !CLIENT_ID) {
  console.warn('Cognito env vars not set. Auth will not work.')
}

export const userPool = new CognitoUserPool({
  UserPoolId: POOL_ID || 'us-east-1_placeholder',
  ClientId:   CLIENT_ID || 'placeholder',
})

// ─── Types ──────────────────────────────────────────────────────
export interface AuthUser {
  id: string
  email: string
  tier: 'free' | 'monthly' | 'yearly' | 'lifetime'
  accessToken: string
  idToken: string
}

// ─── Sign Up ─────────────────────────────────────────────────────
export async function signUp(email: string, password: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase()
  return new Promise((resolve, reject) => {
    const attrs = [new CognitoUserAttribute({ Name: 'email', Value: normalizedEmail })]
    userPool.signUp(normalizedEmail, password, attrs, [], (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

// ─── Confirm Sign Up ─────────────────────────────────────────────
export async function confirmSignUp(email: string, code: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase()
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: normalizedEmail, Pool: userPool })
    user.confirmRegistration(code, true, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

// ─── Sign In ─────────────────────────────────────────────────────
export async function signIn(email: string, password: string): Promise<AuthUser | 'MFA_REQUIRED'> {
  const normalizedEmail = email.trim().toLowerCase()
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: normalizedEmail, Pool: userPool })
    const authDetails = new AuthenticationDetails({ Username: normalizedEmail, Password: password })
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(sessionToUser(normalizedEmail, session)),
      onFailure: (err) => reject(err),
      newPasswordRequired: () => reject(new Error('Password reset required.')),
      totpRequired: () => {
        _pendingMFAUser  = user
        _pendingMFAEmail = normalizedEmail
        resolve('MFA_REQUIRED')
      },
    })
  })
}

// ─── Get Current Session ─────────────────────────────────────────
export async function getSession(): Promise<AuthUser | null> {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser()
    if (!user) return resolve(null)
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) return resolve(null)
      const email = session.getIdToken().payload.email as string
      // If custom:plan is missing from cached token, force a refresh to get updated attributes
      const hasPlan = !!session.getIdToken().payload['custom:plan']
      if (!hasPlan) {
        user.refreshSession(session.getRefreshToken(), (_rErr: Error | null, newSession: CognitoUserSession | null) => {
          resolve(sessionToUser(email, newSession?.isValid() ? newSession : session))
        })
      } else {
        resolve(sessionToUser(email, session))
      }
    })
  })
}

// ─── Sign Out ─────────────────────────────────────────────────────
export function signOut(): void {
  const user = userPool.getCurrentUser()
  user?.signOut()
  Object.keys(localStorage)
    .filter(k => k.startsWith('CognitoIdentityServiceProvider'))
    .forEach(k => localStorage.removeItem(k))
}

// ─── Forgot Password ─────────────────────────────────────────────
export async function forgotPassword(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase()
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: normalizedEmail, Pool: userPool })
    user.forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    })
  })
}

// ─── Confirm New Password ─────────────────────────────────────────
export async function confirmNewPassword(email: string, code: string, newPassword: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase()
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: normalizedEmail, Pool: userPool })
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    })
  })
}

// ─── Helper ───────────────────────────────────────────────────────
function sessionToUser(email: string, session: CognitoUserSession): AuthUser {
  const idToken     = session.getIdToken()
  const accessToken = session.getAccessToken()
  const payload     = idToken.payload
  const rawTier     = payload['custom:plan'] as string | undefined
  const tier = (rawTier === 'monthly' || rawTier === 'yearly' || rawTier === 'lifetime')
    ? rawTier : 'free'
  return {
    id:           payload['sub'] as string,
    email,
    tier,
    accessToken:  accessToken.getJwtToken(),
    idToken:      idToken.getJwtToken(),
  }
}

// ─── MFA helpers ─────────────────────────────────────────────────
// Holds the CognitoUser mid-way through an MFA login (between password OK and TOTP entry)
let _pendingMFAUser: CognitoUser | null = null
let _pendingMFAEmail = ''

export async function getMFAStatus(): Promise<boolean> {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser()
    if (!user) return resolve(false)
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) return resolve(false)
      user.getUserData((err2, data) => {
        if (err2 || !data) return resolve(false)
        resolve(data.PreferredMfaSetting === 'SOFTWARE_TOKEN_MFA')
      })
    })
  })
}

export async function setupTOTP(): Promise<string> {
  return new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser()
    if (!user) return reject(new Error('Not authenticated'))
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) return reject(new Error('Session expired. Please log in again.'))
      user.associateSoftwareToken({
        associateSecretCode: (secretCode) => resolve(secretCode),
        onFailure: (err2) => reject(err2),
      })
    })
  })
}

export async function verifyAndEnableTOTP(totpCode: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser()
    if (!user) return reject(new Error('Not authenticated'))
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) return reject(new Error('Session expired. Please log in again.'))
      user.verifySoftwareToken(totpCode, 'CertiPrepAI', {
        onSuccess: () => {
          user.setUserMfaPreference(null, { Enabled: true, PreferredMfa: true }, (err2) => {
            if (err2) reject(err2)
            else resolve()
          })
        },
        onFailure: (err2) => reject(err2),
      })
    })
  })
}

export async function disableTOTP(): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser()
    if (!user) return reject(new Error('Not authenticated'))
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) return reject(new Error('Session expired. Please log in again.'))
      user.setUserMfaPreference(null, { Enabled: false, PreferredMfa: false }, (err2) => {
        if (err2) reject(err2)
        else resolve()
      })
    })
  })
}

export async function completeMFASignIn(totpCode: string): Promise<AuthUser> {
  if (!_pendingMFAUser) throw new Error('No pending MFA session.')
  const user = _pendingMFAUser
  const email = _pendingMFAEmail
  return new Promise((resolve, reject) => {
    user.sendMFACode(totpCode, {
      onSuccess: (session) => {
        _pendingMFAUser = null
        _pendingMFAEmail = ''
        resolve(sessionToUser(email, session))
      },
      onFailure: (err) => {
        _pendingMFAUser = null
        _pendingMFAEmail = ''
        reject(err)
      },
    }, 'SOFTWARE_TOKEN_MFA')
  })
}
