// db.js

const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel_website",
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

process.on("SIGINT", () => {
    connection.end();
    process.exit();
});

module.exports = connection;