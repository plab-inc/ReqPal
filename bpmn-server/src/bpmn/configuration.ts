import { Configuration, DataStore, DefaultAppDelegate, Logger, ModelsDatastore, NoCacheManager } from "bpmn-server";

const dotenv = require('dotenv');
const res = dotenv.config();

const templatesPath = __dirname + '/emailTemplates/';
var configuration = new Configuration(
	{
		definitionsPath: process.env.DEFINITIONS_PATH,
		templatesPath: templatesPath,
		timers: {
			precision: 3000,
		},
		database: {
			MongoDB:
			{
				db_url: process.env.MONGO_DB_URL
			}
		},
		apiKey: process.env.API_KEY,
		/* Define Server Services */
		logger: function (server) {
			new Logger(server);
		},
		definitions: function (server) {
			//TODO Move to a DB too maybe
			return new ModelsDatastore(server);
		},
		appDelegate: function (server) {
			return new DefaultAppDelegate(server)
		},
		dataStore: function (server) {
			return new DataStore(server);
		},
		cacheManager: function (server) {
			return new NoCacheManager(server);
		},
	});


export { configuration };
