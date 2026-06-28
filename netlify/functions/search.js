const tmdbService = require('./tmdbService');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    try {
        const query = event.queryStringParameters?.q;
        const page = event.queryStringParameters?.page || 1;

        if (!query || query.trim() === '') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Search query is required'
                })
            };
        }

        const tmdbResults = await tmdbService.search(query, page);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                query: query,
                results: tmdbResults.results || []
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
