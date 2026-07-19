module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'online',
    app: 'SikhSphere / Akaal Seva API',
    message: 'Welcome to the SikhSphere Edge API server',
    endpoints: {
      hukamnama: '/api/hukamnama'
    }
  });
};
