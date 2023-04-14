const app = require("./app");
const connectDB = require("./dbconnector");
connectDB();
// Create Environment variable for port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The API system is running on ${PORT}...`);
});