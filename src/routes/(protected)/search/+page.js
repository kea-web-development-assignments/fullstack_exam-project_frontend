import { PUBLIC_API_URL } from '$env/static/public';

export async function load() {
    let tagsData, platformsData, gamesCountData;
    try {
        const [tagsResponse, platformsResponse, gamesCountResponse] = await Promise.all([
            fetch(`${PUBLIC_API_URL}/tags`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }),
            fetch(`${PUBLIC_API_URL}/platforms`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }),
            fetch(`${PUBLIC_API_URL}/games-count`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }),
        ]);

        [tagsData, platformsData, gamesCountData] = await Promise.all([
            tagsResponse.json(),
            platformsResponse.json(),
            gamesCountResponse.json(),
        ]);
    } catch (error) {
        console.error('Failed to get tags, platforms, and games count:', error);
        return {
            error: { message: 'Something went wrong while fetching tags, platforms, and games count.' }
        };
    }

    return {
        tags: tagsData?.tags || [],
        platforms: platformsData?.platforms || [],
        gamesCount: gamesCountData?.count || 0,
    };
}
