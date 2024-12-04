import { PUBLIC_API_URL } from '$env/static/public';

export async function load({ params }) {
    let tagsData, platformsData;
    try {
        const [tagsResponse, platformsResponse] = await Promise.all([
            fetch(`${PUBLIC_API_URL}/tags`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }),
            fetch(`${PUBLIC_API_URL}/platforms`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
        ]);

        [tagsData, platformsData] = await Promise.all([
            tagsResponse.json(),
            platformsResponse.json()
        ]);
    } catch (error) {
        console.error('Failed to get tags and platforms:', error);
        alert('Something went wrong with getting tags and platforms, try again later');
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
        tags: tagsData?.tags?.map(tag => ({ _id: tag._id, name: tag.name })),
        platforms: platformsData?.platforms?.map(platform => ({ _id: platform._id, name: platform.name }))
    };
}
