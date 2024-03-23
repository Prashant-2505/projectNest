import jwt from 'jsonwebtoken';

export default async function GET(req, res) {
    try {
        // Extract the cookie header from the request headers
        const cookieHeader = req.headers.cookie;

        if (cookieHeader) {
            // Split the cookie header into individual cookies
            const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
            // Find the cookie with the specified name (e.g., 'token')
            const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));

            if (tokenCookie) {
                // Extract the value of the token from the cookie
                const token = tokenCookie.split('=')[1];

                // Verify the token
                const decodedValue = jwt.verify(token, process.env.JWT_SECRET);

                return res.json({
                    success: true,
                    decodedValue
                });
            } else {
                console.log('Token cookie not found');
                return res.json({
                    success: false,
                    message: 'Token cookie not found'
                });
            }
        } else {
            console.log('Cookie header not found');
            return res.json({
                success: false,
                message: 'Cookie header not found'
            });
        }
    } catch (error) {
        console.error('Error verifying JWT token:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error verifying JWT token',
            error: error.message
        });
    }
}
