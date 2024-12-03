import { PUBLIC_API_URL } from '$env/static/public';

export async function load({ params }) {
    let gamesData, tagsData, platformsData;
    try {
        const [gamesResponse, tagsResponse, platformsResponse] = await Promise.all([
            fetch(`${PUBLIC_API_URL}/games`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }),
            fetch(`${PUBLIC_API_URL}/tags`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }),
            fetch(`${PUBLIC_API_URL}/platforms`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
        ]);

        [gamesData, tagsData, platformsData] = await Promise.all([
            gamesResponse.json(),
            tagsResponse.json(),
            platformsResponse.json()
        ]);
    } catch (error) {
        console.error('Failed to get games, tags, and platforms:', error);
        alert('Something went wrong with getting games, tags, and platforms, try again later');
        return;
    }

    if(gamesData?.error?.message) {
        alert(`Failed to get games: ${gamesData.error.message}`);
        return;
    }
    if(tagsData?.error?.message) {
        alert(`Failed to get tags: ${tagsData.error.message}`);
        return;
    }
    if(platformsData?.error?.message) {
        alert(`Failed to get platforms: ${platformsData.error.message}`);
        return;
    }

    return {
        games: gamesData?.games,
        tags: tagsData?.tags?.map(tag => ({ _id: tag._id, name: tag.name })),
        platforms: platformsData?.platforms?.map(platform => ({ _id: platform._id, name: platform.name }))
    };
}
