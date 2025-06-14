const mongoose = require('./config/database');
const User = require('./models/User');
const Loan = require('./models/Loan');
const Transaction = require('./models/Transaction');
const Payment = require('./models/Payment');

async function initializeDatabase() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Loan.deleteMany({});
        await Transaction.deleteMany({});
        await Payment.deleteMany({});

        console.log('Cleared existing data');

        // Create test users
        const user1 = await User.create({
            email: 'john@example.com',
            password: 'password123',
            name: 'John Doe',
            phone: '1234567890',
            creditScore: 750,
            isVerified: true
        });

        const user2 = await User.create({
            email: 'jane@example.com',
            password: 'password123',
            name: 'Jane Smith',
            phone: '0987654321',
            creditScore: 800,
            isVerified: true
        });

        console.log('Test users created successfully');

        // Create a sample loan
        const loan = await Loan.create({
            amount: 5000.00,
            interestRate: 5.5,
            term: 12,
            purpose: 'Home Renovation',
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000), // 12 months from now
            borrower: user1._id,
            lender: user2._id
        });

        console.log('Sample loan created successfully');

        // Create sample transactions
        const transaction = await Transaction.create({
            amount: 5000.00,
            type: 'LOAN_DISBURSEMENT',
            status: 'COMPLETED',
            transactionDate: new Date(),
            loan: loan._id,
            sender: user2._id,
            receiver: user1._id
        });

        console.log('Sample transaction created successfully');

        // Create sample payments
        const payment = await Payment.create({
            amount: 500.00,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            status: 'PENDING',
            loan: loan._id
        });

        console.log('Sample payment created successfully');
        console.log('Database initialization completed successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run the initialization
initializeDatabase(); 