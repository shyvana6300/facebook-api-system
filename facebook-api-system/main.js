const app = require("./app");
const connectDB = require("./dbconnector");
connectDB();
// Create Environment variable for port
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
    console.log(`The API system is running on ${PORT}...`);
});