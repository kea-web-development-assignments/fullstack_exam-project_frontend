import { PUBLIC_API_URL } from '$env/static/public';

export async function load({ params }) {
    let data;
    try {
        const response = await fetch(`${PUBLIC_API_URL}/games/${params.slug}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        data = await response.json();
    } catch (error) {
        console.error('Failed to get games:', error);
        alert('Something went wrong with getting the game, try again later');
        return;
    }

    if(data?.error?.message) {
        alert(`Failed to get game: ${data.error.message}`);
        return;
    }

    return { game: data?.game };
}
