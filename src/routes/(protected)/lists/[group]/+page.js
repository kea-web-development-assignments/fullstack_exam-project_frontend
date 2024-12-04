
import { PUBLIC_API_URL } from '$env/static/public';

export async function load({ params }) {
    const { group } = params;

    let data;
    try {
        const response = await fetch(`${PUBLIC_API_URL}/me/list?group=${group}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        data = await response.json();
    } catch (error) {
        console.error('Failed to get list:', error);
        return { error: 'Failed to load list' };
    }

    if (data?.error) {
        return { error: data.error };
    }

    return { games: data.games };
}
