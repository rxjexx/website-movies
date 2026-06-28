const tmdbService = require('./tmdbService');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    try {
        const page = event.queryStringParameters?.page || 1;
        const data = await tmdbService.getPopularMovies(page);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: data
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
