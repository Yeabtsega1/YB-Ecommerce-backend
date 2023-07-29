// const express = require('express');
// const app = express();
// const dotenv = require('dotenv');
// dotenv.config();
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');

// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((err) => {
//   console.error(err);
// });

// // Define MongoDB Schemas and Models
// const userSchema = new mongoose.Schema({
//   fullname: String,
//   email: String,
//   password: String,
// });

// const User = mongoose.model('User', userSchema);

// // Register route
// app.post('/api/register', async (req, res) => {
//   try {
//     const { fullname, email, password } = req.body;
//     if (!fullname || !email || !password) {
//       return res.status(400).json({ error: 'Fill the credentials properly' });
//     }

//     // Save user to the MongoDB database
//     const newUser = new User({ fullname, email, password });
//     await newUser.save();

//     // Create and return JWT token
//     const user = { name: fullname };
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
//     res.json({ accessToken: accessToken, message: 'Registration successful' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Login route
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Fill the credentials properly' });
//     }

//     // Check if the user exists in the database
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Check if the provided password matches the stored password
//     if (user.password !== password) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }

//     // User login successful
//     // Create and return JWT token
//     const accessToken = jwt.sign({ userId: user._id, name: user.fullname }, process.env.ACCESS_TOKEN);
//     res.json({ accessToken, message: 'Login successful' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Rest of the code...

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server is running on ${port}`);
// });

const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error(err);
});

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'Fill the credentials properly' });
    }

    const newUser = new User({ fullname, email, password });
    await newUser.save();

    const user = { name: fullname };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
    res.json({ accessToken: accessToken, message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Fill the credentials properly' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const accessToken = jwt.sign({ userId: user._id, name: user.fullname }, process.env.ACCESS_TOKEN);
    res.json({ accessToken, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
