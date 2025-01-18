const express = require("express");
const router = express.Router();
const connection = require("./db"); // Import the DB connection
const { v4: uuidv4 } = require('uuid');



router.post('/create-account', async (req, res) => {
    const { email_address,password} = req.body;
    console.log(email_address,password)
    try {
      const userId = await createUser({ "email_address":email_address, "password":password });
      console.log('User created with ID:', userId);
      res.status(201).json({userId});
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: "Error creating user" });
    }
  });


  async function createUser(userData) {
    console.log(userData)
    try { 
      const userId = uuidv4();
      console.log(userId);
      let userExists = true;
      while (userExists) {
        const rows = connection.query('SELECT * FROM accounts WHERE id = ?', [userId]);
        userExists = rows.length > 0;
        if (userExists) {
          userId = uuidv4(); // Generate a new ID if duplicate found
        }

      }
      console.log(userId)
      const sql = 'INSERT INTO accounts (id, email_address, password) VALUES (?, ?, ?)';
     const values = [userId, userData.email_address,userData.password];
     connection.query(
        sql,
        values,
        (err, updateResult) => {
          if (err) {
            console.error("Error adding user data:", err);
          }
          console.log('account added in Database ',userData.email_address)
        }
      );
  
      return userId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }


//   router.post('/login-account-validation', async (req, res) => {
//     const { email_address, password } = req.body;
  
//     try {
//       const isValid = await validateUser({ email_address, password });
  
//       if (isValid) {
//         // Handle successful login
//         res.status(200).json({ message: 'Login successful' });
//       } else {
//         res.status(401).json({ message: isValid }); // Send the error message
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       if (error==='Incorrect password'){
//         res.status(200).json({ message: "Incorrect password"})
//       }
//       else if (error==='User not found'){
//       res.status(200).json({ message: 'User not found' });
//         }
//         else{
//         res.status(500).json({ message: 'Internal Server Error' });
//         }
//   };
// });


router.post('/login-account-validation', async (req, res) => {
    const { email_address, password } = req.body;
    try {
      const isValid = await validateUser({ email_address, password });
      if (isValid === true) {
        const query = 'SELECT id FROM chessy_database.accounts WHERE email_address = ?';
        connection.query(query, [email_address], (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }
          if (results.length > 0) {
            const userId = results[0].id;
            res.status(200).json({ message: 'Login successful', userId });
          } else {
            res.status(404).json({ message: 'User not found' });
          }
        });
      } else {
        res.status(401).json({ message: isValid }); // Error message from validation
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error === 'Incorrect password') {
        res.status(200).json({ message: 'Incorrect password' });
      } else if (error === 'User not found') {
        res.status(200).json({ message: 'User not found' });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
   });

  
//     async function validateUser(userData) {
//     console.log('userData.email_address'+userData.email_address);
//     const rows = connection.query('SELECT * FROM chessy_database.accounts WHERE email_address = ?', [userData.email_address]);
//     userExists = rows.length > 0;
//     console.log(userExists);
    
//     try {
//       const results = connection.query(sql, values);
//       console.log(results)
//       if (results.length === 0) {
//         throw new Error('User not found');
//       }
//       const user = results[0];
      
//       if (user.password === userData.password) { // Use a password hashing library
//         return true;
//       } else {
//         throw new Error('Incorrect password');
//       }
//     } catch (error) {
//       throw error; // Re-throw the error for handling in the route
//     }
//   }

async function validateUser(userData) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM chessy_database.accounts WHERE email_address = ?';
      const values = [userData.email_address];
  
      connection.query(sql, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const user = results[0];
            console.log(JSON.stringify(results));
            // Assuming you have a password hashing mechanism
            if (user.password === userData.password) {
              resolve(true); // User found and password matches
            } else {
              reject('Incorrect password');
            }
          } else {
            reject('User not found');
          }
        }
      });
    });
  }
  
  




router.post("/updateUser", (req, res) => {
  const {
    id,
    name,
    bio,
    work,
    education,
    gender,
    location,
    hometown,
    height,
    exercise,
    educationLevel,
    interest,
    profilePicture,
  } = req.body; // Data sent via the request body
  const interest_stringified = JSON.stringify(interest);

  // Check if user with the provided ID already exists:
  // const checkUserExistsQuery = "SELECT id FROM users WHERE id = ?";
  const checkUserExistsQuery = "SELECT id FROM chessy_database.accounts WHERE id = ?";

  connection.query(checkUserExistsQuery, [id], (err, result) => {
    if (err) {
      console.error("Error checking for existing user:", err);
      return res.status(500).json("Database error");
    }

    // Update user data if ID exists:
    if (result.length > 0) {
      const updateQuery = "UPDATE chessy_database.accounts SET name = ?, bio = ?, work = ?, education = ?, gender = ?, location = ?, hometown = ?, height = ?, exercise = ?, educationLevel = ?, interest = ?, profilePicture = ? WHERE id = ?";

      connection.query(
        updateQuery,
        [
          name,
          bio,
          work,
          education,
          gender,
          location,
          hometown,
          height,
          exercise,
          educationLevel,
          interest_stringified,
          profilePicture,
          id,
        ],
        (err, updateResult) => {
          if (err) {
            console.error("Error updating user data:", err);
            return res.status(500).json("Database error");
          }
          
          res.status(200).json("User data updated successfully");
        }
      );
    } 
  });
});


router.get('/userDetail', (req, res) => {
    const userId = req.query.userId;
  

  // const query = 'SELECT * FROM users WHERE id = ?';
  const query = 'SELECT * FROM chessy_database.accounts WHERE id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {

      const user = results[0];
            user.interest = JSON.parse(user.interest); // Deserialize the interest string
            console.log('sending from Server to Client ',user)
            res.json(user);
            
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

module.exports = router;

    