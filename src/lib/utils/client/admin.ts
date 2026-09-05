import { invalidateAll } from '$app/navigation';
import { get } from 'svelte/store';
import { apiFetch } from './APIFetch';
import { isAdmin, showPassword } from './writables';

let pending: (() => Promise<void>) | null = null;

export async function refreshAdminStatus(): Promise<boolean> {
	const admin = await apiFetch.checkAdmin();
	isAdmin.set(admin);
	return admin;
}

export function requestAdmin(onSuccess?: () => Promise<void>): void {
	pending = onSuccess ?? null;
	showPassword.set(true);
}

export async function exitAdmin(): Promise<void> {
	await apiFetch.revokeAdmin();
	isAdmin.set(false);
	pending = null;
	showPassword.set(false);
	await invalidateAll();
}

export function cancelAdminRequest(): void {
	showPassword.set(false);
	pending = null;
}

export async function toggleAdmin(): Promise<void> {
	if (get(showPassword)) {
		cancelAdminRequest();
		return;
	}

	if (get(isAdmin)) {
		await exitAdmin();
		return;
	}

	requestAdmin();
}

export async function onPasswordAccepted(): Promise<void> {
	isAdmin.set(true);
	showPassword.set(false);

	const callback = pending;
	pending = null;
	if (callback) {
		await callback();
	}

	await invalidateAll();
}
