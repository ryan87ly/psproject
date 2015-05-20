var path = require('path');

/**
 * return json format config
 * @param {String} config_path - config file path
 */
module.exports.getConfig = function(config_path) {
	return require(path.join(__dirname, config_path));
}
