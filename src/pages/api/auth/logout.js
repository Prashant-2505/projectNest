export default async function (req, res) {
    // Set the cookie to null to delete it
    res.setHeader('Set-Cookie', 'token=; Path=/api/auth; Domain=localhost; Max-Age=0');

    // Send a response indicating successful deletion of the cookie
    res.status(200).json({success:true, message: "Cookie deleted successfully" });
}
