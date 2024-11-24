import { browser } from "$app/environment"
import { goto } from "$app/navigation"

export async function load({ url }) {
    if (browser && !localStorage.getItem('token')) {
        goto(`/login?redirectTo=${url.pathname}`);
    }
}
