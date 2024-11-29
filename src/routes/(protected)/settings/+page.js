import { PUBLIC_API_URL } from '$env/static/public';

export async function load({ params }) {
    let data;
    try {
        const response = await fetch(`${PUBLIC_API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        data = await response.json();
    } catch (error) {
        console.error('Failed to get account:', error);
        alert('Something went wrong with getting your account, try again later');            
        return;
    }

    if(data?.error?.message) {
        alert(`Failed to get your account: ${data.error.message}`);
        return;
    }

    return { user: data };
}
