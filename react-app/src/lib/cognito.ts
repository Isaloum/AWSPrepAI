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
  return new Promise((resolve, reject) => {
    const attrs = [new CognitoUserAttribute({ Name: 'email', Value: email })]
    userPool.signUp(email, password, attrs, [], (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

// ─── Confirm Sign Up ─────────────────────────────────────────────
export async function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool })
    user.confirmRegistration(code, true, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

// ─── Sign In ─────────────────────────────────────────────────────
export async function signIn(email: string, password: string): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool })
    const authDetails = new AuthenticationDetails({ Username: email, Password: password })
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(sessionToUser(email, session)),
      onFailure: (err) => reject(err),
      newPasswordRequired: () => reject(new Error('Password reset required.')),
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
      resolve(sessionToUser(email, session))
    })
  })
}

// ─── Sign Out ─────────────────────────────────────────────────────
export function signOut(): void {
  const user = userPool.getCurrentUser()
  user?.signOut()
  // Force-clear all Cognito tokens from localStorage as a safety net
  Object.keys(localStorage)
    .filter(k => k.startsWith('CognitoIdentityServiceProvider'))
    .forEach(k => localStorage.removeItem(k))
}

// ─── Forgot Password ─────────────────────────────────────────────
export async function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool })
    user.forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    })
  })
}

// ─── Confirm New Password ─────────────────────────────────────────
export async function confirmNewPassword(email: string, code: string, newPassword: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool })
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
