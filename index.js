require('./src/bot');

const express = require('express');
const cors = require('cors');
const api = express();

api.use(cors());
api.use(express.json());

function secure(req, res, next) {
  if (req.headers.authorization !== `Bearer ${process.env.PANEL_SECRET}`) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

const fs = require('fs');
const path = require('path');
const routesPath = path.join(__dirname, 'api', 'routes');

fs.readdirSync(routesPath).forEach(file => {
  if (file.endsWith('.js')) {
    const route = require(path.join(routesPath, file));
    api.use('/admin', secure, route);
  }
});

api.listen(3001, () => console.log('🌐 API PANEL ONLINE on port 3001'));

