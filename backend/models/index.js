const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// User Model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    creditScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Loan Model
const Loan = sequelize.define('Loan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    interestRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    term: {
        type: DataTypes.INTEGER, // in months
        allowNull: false
    },
    purpose: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'DEFAULTED'),
        defaultValue: 'PENDING'
    },
    startDate: {
        type: DataTypes.DATE
    },
    endDate: {
        type: DataTypes.DATE
    }
});

// Transaction Model
const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'INTEREST_PAYMENT'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
        defaultValue: 'PENDING'
    },
    transactionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Payment Model
const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'OVERDUE'),
        defaultValue: 'PENDING'
    },
    paymentDate: {
        type: DataTypes.DATE
    }
});

// Define Relationships
User.hasMany(Loan, { as: 'borrowedLoans', foreignKey: 'borrowerId' });
Loan.belongsTo(User, { as: 'borrower', foreignKey: 'borrowerId' });

User.hasMany(Loan, { as: 'lentLoans', foreignKey: 'lenderId' });
Loan.belongsTo(User, { as: 'lender', foreignKey: 'lenderId' });

Loan.hasMany(Transaction, { foreignKey: 'loanId' });
Transaction.belongsTo(Loan, { foreignKey: 'loanId' });

Loan.hasMany(Payment, { foreignKey: 'loanId' });
Payment.belongsTo(Loan, { foreignKey: 'loanId' });

User.hasMany(Transaction, { as: 'sentTransactions', foreignKey: 'senderId' });
Transaction.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });

User.hasMany(Transaction, { as: 'receivedTransactions', foreignKey: 'receiverId' });
Transaction.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

module.exports = {
    sequelize,
    User,
    Loan,
    Transaction,
    Payment
}; 