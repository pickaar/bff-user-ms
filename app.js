const config = require('./src/config/configs');
const app = require('./src/config/express');
const model = require('./src/models/index')


app.listen(config.port, () => {
    console.log(`Server has Started on PORT ${config.port}`);
});

/**
 * Exports express
 * @public
 */
module.exports = app;
