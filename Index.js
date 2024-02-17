const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate a secure random key
const secretKey = crypto.randomBytes(32).toString("hex");
console.log("Generated Secret Key:", secretKey);

// DB Connection
const dbConnection = require("./DB_connect");

app.use(cors());

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).json({ error: 'Internal server error' }); // Send an error response to the client
});

// Parser Json bodies
app.use(bodyParser.json());

// Parser URL-Encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Registration API endpoint
app.post("/api/v1/register", async (req, res) => {
  // Extract registration data from request body
  const { username, email, password } = req.body;

  // Check if all required fields are present
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert user into the database
    dbConnection.query(
      "INSERT INTO User (username, email, password_hash, registration_date) VALUES (?, ?, ?, NOW())",
      [username, email, hashedPassword],
      (error, results, fields) => {
        if (error) {
          console.error("Error occurred during registration:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
        // Registration successful
        res.status(201).json({ message: "Registration successful" });
      }
    );
  } catch (error) {
    console.error("Error occurred during password hashing:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const JWT_SECRET_KEY = secretKey; // Replace with your secret key

// API endpoint for user login
app.post('/api/v1/login', (req, res) => {
  const { username, password } = req.body;

  // Assuming you have validated the username and password

  // Check if the username and password are correct (pseudo code)
  if (username === username && password === password) {

    const tokan = jwt.sign({username}, secretKey,{
      expiresIn : '30d'
    })
    console.log (tokan);

      // If the credentials are correct, set a cookie
      res.cookie('tokan', tokan, { 
          maxAge: 3600000, // Cookie expiration time (1 hour in milliseconds)
          httpOnly: false // Prevent client-side JavaScript from accessing the cookie
      });

      // You can also set other cookie options as needed, such as domain, secure, etc.

      // Return a success response with the cookie set
      res.status(200).json({ message: 'Login successful', username: username });
  } else {
      // If the credentials are incorrect, return an error response
      res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Insert API
app.post("/api/v1/hotel", (req, res) => {
  const hotel = req.body;
  dbConnection.query("INSERT INTO hotel SET ?", hotel, (err, result) => {
    if (err) {
      console.error("Error inserting hotel:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(201).json({ message: "Hotel inserted successfully" });
  });
});

app.route("/api/v1/hotels/:id?")
  .get((req, res) => {
    const id = req.params.id;

    if (id) {
      // If ID is provided, fetch single hotel
      dbConnection.query(
        "SELECT * FROM hotel WHERE id = ?",
        id,
        (err, result) => {
          if (err) {
            console.error("Error fetching hotel:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          if (result.length === 0) {
            res.status(404).json({ error: "Hotel not found" });
            return;
          }
          res.status(200).json(result[0]);
        }
      );
    } else {
      // If no ID is provided, fetch all hotels
      dbConnection.query("SELECT * FROM hotel", (err, result) => {
        if (err) {
          console.error("Error fetching hotels:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.status(200).json(result);
      });
    }
  })
  .put((req, res) => {
    const id = req.params.id;
    const hotel = req.body;

    // Check if the hotel with the provided ID exists before attempting to update it
    dbConnection.query(
      "SELECT * FROM hotel WHERE id = ?",
      [id],
      (err, rows) => {
        if (err) {
          console.error("Error checking hotel existence:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        // If no hotel found with the provided ID, return an error
        if (rows.length === 0) {
          res.status(404).json({ error: "Hotel not found" });
          return;
        }

        // Update the hotel if it exists
        dbConnection.query(
          "UPDATE hotel SET ? WHERE id = ?",
          [hotel, id],
          (err, result) => {
            if (err) {
              console.error("Error updating hotel:", err);
              res.status(500).json({ error: "Internal server error" });
              return;
            }
            res.status(200).json({ message: "Hotel updated successfully" });
          }
        );
      }
    );
  })
  .delete((req, res) => {
    const id = req.params.id;

    // Check if the hotel with the provided ID exists before attempting to delete it
    dbConnection.query(
      "SELECT * FROM hotel WHERE id = ?",
      [id],
      (err, rows) => {
        if (err) {
          console.error("Error checking hotel existence:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        // If no hotel found with the provided ID, return an error
        if (rows.length === 0) {
          res.status(404).json({ error: "Hotel not found" });
          return;
        }

        // Delete the hotel if it exists
        dbConnection.query(
          "DELETE FROM hotel WHERE id = ?",
          [id],
          (err, result) => {
            if (err) {
              console.error("Error deleting hotel:", err);
              res.status(500).json({ error: "Internal server error" });
              return;
            }
            res.status(200).json({ message: "Hotel deleted successfully" });
          }
        );
      }
    );
  });


// Blog API 
// Create (POST) API
app.post('/api/v1/booking', (req, res) => {
  const { booking_id, user_id, room_id, check_in_date, check_out_date, total_price, status, person } = req.body;

  dbConnection.query(
      'INSERT INTO booking (booking_id, user_id, room_id, check_in_date, check_out_date, total_price, status, person) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [booking_id, user_id, room_id, check_in_date, check_out_date, total_price, status, person],
      (err, result) => {
          if (err) {
              console.error('Error inserting into booking table:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          res.status(201).json({ message: 'Booking created successfully' });
      }
  );
});

// Read (GET) all bookings
app.get('/api/v1/booking', (req, res) => {
  dbConnection.query(
      'SELECT * FROM booking',
      (err, results) => {
          if (err) {
              console.error('Error fetching bookings:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          res.json(results);
      }
  );
});

// Read (GET) a specific booking by ID
app.get('/api/v1/booking/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  dbConnection.query(
      'SELECT * FROM booking WHERE booking_id = ?',
      [bookingId],
      (err, results) => {
          if (err) {
              console.error('Error fetching booking:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          if (results.length === 0) {
              res.status(404).json({ error: 'Booking not found' });
              return;
          }
          res.json(results[0]);
      }
  );
});

// Update (PUT) API
app.put('/api/v1/booking/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  const updatedBooking = req.body;
  dbConnection.query(
      'UPDATE booking SET ? WHERE booking_id = ?',
      [updatedBooking, bookingId],
      (err, result) => {
          if (err) {
              console.error('Error updating booking:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          res.status(200).json({ message: 'Booking updated successfully' });
      }
  );
});

// Delete (DELETE) API
app.delete('/api/v1/booking/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  dbConnection.query(
      'DELETE FROM booking WHERE booking_id = ?',
      [bookingId],
      (err, result) => {
          if (err) {
              console.error('Error deleting booking:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          res.status(200).json({ message: 'Booking deleted successfully' });
      }
  );
});



app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
