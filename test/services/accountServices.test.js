const accountServices = require("../../services/accountServices");
const baseModel = require("../../models/baseModel");
const Account = baseModel.accountModel;
const otpGenerator = require('../../utils/otpGenerator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config/authconfig");

describe('Test checkExpiredOTP()', () => {
    const checkExpiredOTP = accountServices.checkExpiredOTP;
    describe('Test case 1: OTP not exist', () => {
        test('It should return false', () => {
            // Mock dependencies
            const mockOTP = null;
            // Call test function
            const result = checkExpiredOTP(mockOTP);
            // Expect value
            expect(result).toBe(false);
        });
    });

    describe('Test case 2: otp expired', () => {
        test('It should return false', () => {
            // Mock dependencies
            const mockOTP = {
                timeCreated: 1682945076295
            };
            // Call test function
            const result = checkExpiredOTP(mockOTP);
            // Expect value
            expect(result).toBe(false);

        })
    });

    describe('Test case 3: otp pass', () => {
        test('It should return true', () => {
            // Mock dependencies
            const mockOTP = {
                timeCreated: new Date().getTime()
            };
            // Call test function
            const result = checkExpiredOTP(mockOTP);
            // Expect value
            expect(result).toBe(true);

        })
    });
});

describe('Test getAccountById()', () => {
    describe('Test case OK', () => {
        const getAccountById = accountServices.getAccountById;
        test('It should return account', async () => {
            // Mock dependencies
            const mockAccountId = 'mockAccountId';
            Account.findOne = jest.fn(() => 'mockAccount');
            // Call the test function
            const result = await getAccountById(mockAccountId);
            // Expect value
            expect(result).toBe('mockAccount');
        })
    });

    describe('Test case NG: server Error ', () => {
        const getAccountById = accountServices.getAccountById;
        test('It should return error message', async () => {
            // Mock dependencies
            const mockAccountId = 'MockAccountId';
            Account.findOne = (3 / 0);
            // Call the test function and expect value
            expect(async () => {
                await getAccountById(mockAccountId)
            }).rejects.toThrowError();
        });        
    });

    
});

describe('Test findAccountByEmail()', () => {
    describe('Test case OK', () => {
        const findAccountByEmail = accountServices.findAccountByEmail;
        test('It should return account', async () => {
            // Mock dependencies
            const mockEmail = 'mockEmail@gmail.com';
            Account.findOne = jest.fn(() => 'mockAccount');
            // Call the test function
            const result = await findAccountByEmail(mockEmail);
            // Expect value
            expect(result).toBe('mockAccount');
        })
    });
    describe('Test case error: server Error ', () => {
        const findAccountByEmail = accountServices.findAccountByEmail;
        test('It should return error message', async () => {
            // Mock dependencies
            const mockEmail = 'mockEmail@gmail.com';
            Account.findOne = (3 / 0);
            // Call the test function and expect value
            expect(async () => {
                await findAccountByEmail(mockEmail)
            }).rejects.toThrowError();
        });        
    });


});
