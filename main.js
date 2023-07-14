const app = require("./app");
const connectDB = require("./dbconnector");
connectDB();
// Create Environment variable for port
const PORT = process.env.PORT || 80;
app.listen(PORT, '10.0.1.75', () => {
    console.log(`The API system is running on ${PORT}...`);
});