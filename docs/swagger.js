const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const getIp = require('get-ip');
const swaggerUi = require('swagger-ui-express');
const config = yaml.load(fs.readFileSync(path.join(__dirname, "..", "config", "config.yaml"), 'utf8'))[process.env.NODE_ENV || "development"];
const swaggerDoc = yaml.load(fs.readFileSync(path.join(__dirname, "swaggerV3.yaml"), 'utf8'));
module.exports = app => {

    const port = config.comm.nodePort || 8080;

    swaggerDoc["servers"] = getIp().map(item => {
        return {
            url: `http://${item}:${port}/api`
        }
    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
};