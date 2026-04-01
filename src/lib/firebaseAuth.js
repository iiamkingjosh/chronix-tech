import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebaseClient';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  return getAuth(app);
}

export function subscribeToAuthState(callback) {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

function setAdminCookie() {
  document.cookie = 'admin_signed_in=1; path=/; max-age=86400; SameSite=Strict; Secure';
}

function clearAdminCookie() {
  document.cookie = 'admin_signed_in=; path=/; max-age=0; SameSite=Strict; Secure';
}

export async function signInAdminWithGoogle() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase client configuration is missing.');
  }

  const result = await signInWithPopup(auth, provider);
  setAdminCookie();
  return result.user;
}

export async function signOutAdmin() {
  const auth = getFirebaseAuth();
  if (!auth) {
    return;
  }

  await signOut(auth);
  clearAdminCookie();
}

export async function getCurrentUserIdToken() {
  const auth = getFirebaseAuth();
  if (!auth) {
    return null;
  }

  // auth.currentUser may be null immediately after page load while Firebase
  // restores the persisted session. Wait for the first auth state resolution.
  const user = await new Promise((resolve) => {
    if (auth.currentUser !== undefined) {
      resolve(auth.currentUser);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged((resolvedUser) => {
      unsubscribe();
      resolve(resolvedUser);
    });
  });

  if (!user) {
    return null;
  }

  return await user.getIdToken();
}