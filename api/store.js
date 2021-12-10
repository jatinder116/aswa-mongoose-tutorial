// TODO: Ensure you configured CONNECTION_STRING on the server when deployed
// https://docs.microsoft.com/azure/static-web-apps/application-settings
// let connectionString = process.env.CONNECTION_STRING;
let connectionString = "mongodb://azurecosmo-dbs:GIatm6GDTEZvCD3S9xNSSTts5M7rI6TzxQaWGcORaxnDDRGIZE0Y1jgyDsg3EQ3hTY6CtjCFzqvbNvWgvCWzug==@azurecosmo-dbs.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@azurecosmo-dbs@";

// Load mongoose
const mongoose = require('mongoose');

// Create the schema or structure of our object in Mongoose
const taskSchema = new mongoose.Schema({
    title: String, // Add title property of type string
    completed: { // Add completed property
        type: Boolean, // Set type to boolean
        default: false // Set default to false
    },
    userId: String // Id of the user for the task
});

// This model will use our schema and connect to the database
const TaskModel = mongoose.model('task', taskSchema);


// Create the schema or structure of our object in Mongoose
const walletSchema = new mongoose.Schema({
    walletAddress: { type: String, default: '' }, // Add title property of type string
});

// This model will use our schema and connect to the database
const WalletModel = mongoose.model('wallet', walletSchema);

module.exports = {
    // Used to connect to the database
    connect: async () => {
        // If connection is already made, return
        if (mongoose.connection.readyState === 1) return;

        // If there is no connection string, an in-memory database will be created
        // This is for development purposes only
        if (!connectionString) {
            // Load the mongodb-memory-server library
            connectionString = await getInMemoryServerUri();
        }

        // Connect to the database
        mongoose.connect(
            connectionString,
            { // boiler plate values
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
    },

    getAll: async (userId) => {
        return await TaskModel.find({userId});
    },

    create: async (task) => {
        console.log("walletedata==",task)
        return await TaskModel.create(task);
    },

    update: async (id, task) => {
        return await TaskModel.updateOne({ _id: id }, task);
    },

    postWalletAddress : async (walletData) =>{
        console.log("walletedata==",walletData)
        return await WalletModel.create(walletData);
    },

    checkWalletAddress : async (walletAddress) =>{
        console.log("walletedata==",walletAddress)
        return await WalletModel.find(walletAddress);
    }
}


// Helper functions
async function getInMemoryServerUri() {
    // Load the library
    const { MongoMemoryServer } = require('mongodb-memory-server');

    // Create the in-memory server
    const server = await MongoMemoryServer.create();

    // Return the in-memory connection string
    return server.getUri();
}
