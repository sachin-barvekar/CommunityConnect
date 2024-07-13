exports.Signout = async(req, res) => {
    // Clear the authentication cookie
    res.clearCookie('CommunityConnect', { path: '/' });
    
    // Send response back to client
    res.json({ success: true, message: 'Signed out successfully' });
  };