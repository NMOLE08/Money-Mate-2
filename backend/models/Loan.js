const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    term: {
        type: Number, // in months
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'DEFAULTED'],
        default: 'PENDING'
    },
    startDate: Date,
    endDate: Date,
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan; 