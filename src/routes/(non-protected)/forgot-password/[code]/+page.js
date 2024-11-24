import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';

export async function load({ params }) {
    let data;
    try {
        const response = await fetch(`${PUBLIC_API_URL}/forgot-password/${params.code}`);
        data = await response.json();
    } catch (error) {
        console.error('Failed to validate reset code:', error);
        alert('Something went wrong when validating reset code, try again later');            
        goto('/login');
        return;
    }

    if(data?.error?.message) {
        alert(`Failed to validate reset code: ${data.error.message}`);
        goto('/login');
        return;
    }
}
