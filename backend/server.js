const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;



app.use(cors());
app.use(bodyParser.json());


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('DB connection established successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); 
  }
};

// const connectDB = async() =>  {
//     try {
//         await mongoose.connect(process.env.DB_URL);
//         console.log("DB Connection Established Successfully")
   
//     } catch (error) {
//         console.log(error)
//     }    
// };



const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Contact = mongoose.model('Contact', contactSchema);


app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Contact information saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


const startServer = async () => {
  await connectDB(); 
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer();