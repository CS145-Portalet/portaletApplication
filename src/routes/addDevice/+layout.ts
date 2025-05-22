//import type { LayoutLoad } from './$types.js';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { authStore } from '../../store/store.js'; // adjust path as needed

export const load = async () => {
    const user = get(authStore).user;

    if (!user) {
        throw redirect(302, '/');
    }

    return { user };
};
