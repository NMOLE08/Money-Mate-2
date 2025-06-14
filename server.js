const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/moneymate', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('Login successful for user:', user.email);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            'your_jwt_secret', // In production, use environment variable
            { expiresIn: '24h' }
        );

        const response = {
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        };
        
        console.log('Sending response:', response);
        res.json(response);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create test user route
app.post('/api/auth/create-test-user', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = new User({
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User'
        });
        await user.save();
        res.json({ message: 'Test user created successfully' });
    } catch (error) {
        console.error('Error creating test user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 