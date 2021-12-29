const app = require('./app');
const http = require('http');
const path = require('path');
const yaml = require("js-yaml");
const fs = require("fs");
const logger = require('./config/winston')('server');
const config = yaml.load(fs.readFileSync(path.join(__dirname, "config", "config.yaml"), 'utf8'))[process.env.NODE_ENV || "development"];
const PORT = config.comm.nodePort || 8080;

/* Node Server */
const httpServer = http.createServer(app);
httpServer.listen(PORT, (err) => {
    if (err) {
        logger.error(`Express Server has failed on port: ${PORT}`);
    }
    logger.info(`Express server has started on port ${PORT}`);
});

