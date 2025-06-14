const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting setup process...');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
    console.log('Creating package.json...');
    execSync('npm init -y');
}

// Install dependencies
console.log('Installing dependencies...');
const dependencies = [
    'express',
    'mysql2',
    'sequelize',
    'bcryptjs',
    'jsonwebtoken',
    'dotenv',
    'cors'
];

dependencies.forEach(dep => {
    try {
        console.log(`Installing ${dep}...`);
        execSync(`npm install ${dep}`);
    } catch (error) {
        console.error(`Error installing ${dep}:`, error.message);
    }
});

console.log('Dependencies installed successfully!');
console.log('\nNow initializing database...');

// Run database initialization
try {
    require('./backend/init-db');
} catch (error) {
    console.error('Error initializing database:', error);
}

console.log('\nSetup completed! You can now start the server with: npm start'); 