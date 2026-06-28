exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    try {
        const movieId = event.path.split('/').pop();
        
        if (!movieId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Movie ID is required'
                })
            };
        }

        // Top 3 reliable working streaming servers
        const streams = [
            {
                name: 'VidSrc.mov',
                url: `https://vidsrc.mov/embed/movie/${movieId}`,
                type: 'iframe',
                quality: '1080p',
                status: 'Primary - 100% Reliable'
            },
            {
                name: 'AutoEmbed',
                url: `https://autoembed.co/movie/id/${movieId}`,
                type: 'iframe',
                quality: '720p-1080p',
                status: 'Auto-Sourced - Fast'
            },
            {
                name: 'VidSrc.lol',
                url: `https://vidsrc.lol/embed/movie/${movieId}`,
                type: 'iframe',
                quality: '1080p/4K',
                status: 'Backup - Reliable'
            }
        ];

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                movieId: movieId,
                streams: streams,
                note: 'Three most reliable servers. VidSrc.mov is primary with 100% reliability.'
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
