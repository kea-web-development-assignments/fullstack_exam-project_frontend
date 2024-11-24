import { browser } from "$app/environment"
import { goto } from "$app/navigation"

export async function load() {
    if (browser && localStorage.getItem('token')) {
        goto('/dashboard');
    }
}
