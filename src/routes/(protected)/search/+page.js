import { PUBLIC_API_URL } from '$env/static/public';

export async function load() {
    let tagsData, platformsData;
    try {
        const [tagsResponse, platformsResponse] = await Promise.all([
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
        ]);

        [tagsData, platformsData] = await Promise.all([
            tagsResponse.json(),
            platformsResponse.json(),
        ]);
    } catch (error) {
        console.error('Failed to get tags and platforms:', error);
        return {
            error: { message: 'Something went wrong while fetching tags and platforms.' }
        };
    }

    return {
        tags: tagsData?.tags || [],
        platforms: platformsData?.platforms || [],
    };
}
