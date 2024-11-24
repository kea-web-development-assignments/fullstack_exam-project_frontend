import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';

export async function load({ params }) {
    let data;
    try {
        const response = await fetch(`${PUBLIC_API_URL}/verify-account`, {
            method: 'POST',
            body: JSON.stringify({ code: params.code }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        data = await response.json();
    } catch (error) {
        console.error('Failed to verify account:', error);
        alert('Something went wrong when verifying your account, try again later');            
        goto('/login');
        return;
    }

    if(data?.error?.message) {
        alert(`Failed to verify your account: ${data.error.message}`);
        goto('/login');
        return;
    }

    alert('Your account has been verified!');
    goto('/login');
}
