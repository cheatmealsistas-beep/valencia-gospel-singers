'use server';

import { redirect } from 'next/navigation';

import {
  handleLogin,
  handleLogout,
  handleMagicLink,
  handleRegister,
  handleResetPassword,
  handleUpdatePassword,
  handleResendVerification,
} from './auth.handler';
import { signInWithOAuth } from './auth.command';
import type { AuthState } from './types';
import type { OAuthProvider } from '@/shared/auth';

export async function loginAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const locale = (formData.get('locale') as string) || 'en';

  const result = await handleLogin(email, password);

  if (result.success) {
    redirect(`/${locale}/admin`);
  }

  return { ...result, email };
}

export async function registerAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const locale = (formData.get('locale') as string) || 'en';

  const result = await handleRegister(email, password, locale);

  return { ...result, email };
}

export async function magicLinkAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string;
  const locale = (formData.get('locale') as string) || 'en';

  const result = await handleMagicLink(email, locale);

  return { ...result, email };
}

export async function logoutAction(formData?: FormData): Promise<void> {
  const locale = formData?.get('locale') as string || 'en';
  const result = await handleLogout();

  if (result.success) {
    redirect(`/${locale}`);
  }

  // On error, redirect to home anyway (user will see they're still logged in)
  redirect(`/${locale}`);
}

export async function oauthAction(provider: OAuthProvider) {
  const result = await signInWithOAuth(provider);

  if (result.url) {
    // OAuth URLs are external, cast to satisfy typed routes
    redirect(result.url as any);
  }

  return { success: false, error: result.error ?? 'Failed to initiate OAuth' };
}

export async function resetPasswordAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string;
  const locale = (formData.get('locale') as string) || 'en';

  const result = await handleResetPassword(email, locale);

  return { ...result, email };
}

export async function updatePasswordAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const locale = (formData.get('locale') as string) || 'en';

  const result = await handleUpdatePassword(password, confirmPassword);

  if (result.success) {
    redirect(`/${locale}/login`);
  }

  return result;
}

export async function resendVerificationAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string;

  const result = await handleResendVerification(email);

  return result;
}
