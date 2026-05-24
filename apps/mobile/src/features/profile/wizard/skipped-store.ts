import * as SecureStore from 'expo-secure-store';
import type { StepId } from '@rental-platform/profile-schema';

// Local-only record of optional steps the user explicitly tapped "Skip"
// on. The server has no concept of "skipped vs. unanswered" — a null
// stays null whether the user left it untouched or deliberately moved
// past it. We need the distinction in the wizard so the resume logic
// doesn't bounce the user back to a question they already dismissed.
//
// Kept in expo-secure-store (Keychain on iOS, EncryptedSharedPreferences
// on Android) under a single CSV key. Tiny payload, no migrations needed.
// Cleared on signout so a new account on the same device starts fresh.

const KEY = 'plekje.wizard.skipped';

let cache: Set<StepId> | null = null;

async function load(): Promise<Set<StepId>> {
  if (cache) return cache;
  const raw = await SecureStore.getItemAsync(KEY);
  cache = new Set(raw ? (raw.split(',').filter(Boolean) as StepId[]) : []);
  return cache;
}

async function persist(set: Set<StepId>): Promise<void> {
  cache = set;
  await SecureStore.setItemAsync(KEY, [...set].join(','));
}

export async function getSkippedSteps(): Promise<ReadonlySet<StepId>> {
  return load();
}

export async function markStepSkipped(step: StepId): Promise<void> {
  const set = new Set(await load());
  set.add(step);
  await persist(set);
}

export async function unmarkStepSkipped(step: StepId): Promise<void> {
  const set = new Set(await load());
  if (set.delete(step)) await persist(set);
}

export async function clearSkippedSteps(): Promise<void> {
  cache = new Set();
  await SecureStore.deleteItemAsync(KEY);
}
