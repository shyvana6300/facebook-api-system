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

describe("Test createProfileObject()", () => {
    test('It should return object profile', () => {
        const createProfileObject = accountServices.createProfileObject;
        const mockfile = {
            originalname: 'mockFileName'
        } 
        const mockFullName = 'mockFullName'; 
        const mockBirthday = "1996-10-16"; 
        const mockJob = 'mockJob'; 
        const mockAddress = 'mockAddress'; 
        const mockGender = 'mockGender'; 
        const mockProtocol = 'mockProtocol';
        const mockHost = 'mockHost';
        const result = createProfileObject(mockfile, mockFullName, mockBirthday, mockJob, mockAddress, mockGender, mockProtocol, mockHost);
        expect(result).toStrictEqual({
            avatarUrl: `mockProtocol://mockHost/avatar/mockFileName`,
            fullName: 'mockFullName',
            birthday: new Date("1996-10-16"),
            job: 'mockJob',
            address: 'mockAddress',
            gender: 'mockGender'
        })
    })
});

describe("Test updateProfile()", () => {
    const updateProfile = accountServices.updateProfile;
    describe("Test case OK", () => {
        test('It should return result', async () => {
            // Mock dependencies
            const mockReq = {
                body: {
                    "fullName": "your name",
                    "birthday": "1992-10-16",
                    "job": "your job",
                    "address": "your address",
                    "gender": "your gender"
                  },
                  email: 'mockEmail@gmail.com',
                  get: jest.fn((arg) => 'mock')
            }
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => {}),
                rollback: jest.fn(() => {}) 
            });
            accountServices.createProfileObject = jest.fn(() => 'mockObject');
            Account.update = jest.fn(() => 'mockResult');
            // Call the test function
            const result = await updateProfile(mockReq);
            expect(result).toBe('mockResult');

        });
    });
    describe("Test case NG: server Error", () => {
        test('It should throw error', async () => {
            // Mock dependencies
            const mockReq = {
                body: {
                    "fullName": "your name",
                    "birthday": "1992-10-16",
                    "job": "your job",
                    "address": "your address",
                    "gender": "your gender"
                  },
                  email: 'mockEmail@gmail.com',
                  get: jest.fn((arg) => 'mock')
            }
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => {}),
                rollback: jest.fn(() => {}) 
            });
            accountServices.createProfileObject = jest.fn(() => 'mockObject');
            Account.update = (3/0);
            // Call the test function
            expect(async () => {
                await updateProfile(mockReq)
            }).rejects.toThrowError();
        });
    });
});

describe("Test generateURLForgetPassword()", () => {
    const generateURLForgetPassword = accountServices.generateURLForgetPassword;
    test("It should return URL reset password", async () => {
        // Mock dependencies
        const mockEmail = 'mockEmail@gmail.com';
        const mockHost = 'mockHost';
        const mockProtocol = 'mockProtocol';
        jwt.sign = jest.fn(() => 'mockToken');
        accountServices.generateToken = await jest.fn();
        await accountServices.generateToken.mockReturnValue('mockTokesn');
        // Call test function and expect value
        const result = await generateURLForgetPassword(mockEmail, mockProtocol, mockHost);
        expect(result).toBe('mockProtocol://mockHost/account/resetPassword/mockToken');
    })
});

describe("Test generateToken()", () => {
    const generateToken = accountServices.generateToken;
    test('It should return result', () => {
        // Mock dependencies
        const mockEmail = 'mockEmail@gmail.com';
        const mockExpired = 'mockExpired';
        jwt.sign = jest.fn(() => 'mockResult');
        // Call test function and expect value
        const result = generateToken(mockEmail, mockExpired);
        expect(result).toBe('mockResult');
    });
});

describe("Test resetPassword()", () => {
    const resetPassword = accountServices.resetPassword;
    describe("Test case OK", () => {
        test('It should return result', async () => {
            // Mock dependencies
            const mockEmail = 'mockEmail@gmail.com';
            const mockNewPassword = 'mockNewPassword';
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => {}),
                rollback: jest.fn(() => {}) 
            });
            Account.update = jest.fn(() => 'mockResult');
            // Call the test function
            const result = await resetPassword(mockEmail, mockNewPassword);
            expect(result).toBe('mockResult');

        });
    });

    describe("Test case NG", () => {
        test('It should return result', async () => {
            // Mock dependencies
            const mockEmail = 'mockEmail@gmail.com';
            const mockNewPassword = 'mockNewPassword';
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => {}),
                rollback: jest.fn(() => {}) 
            });
            Account.update = (3/0);
            // Call the test function and expect result
            expect(async () => {
                await resetPassword(mockEmail, mockNewPassword);
            }).rejects.toThrowError();

        });
    });
    
});

describe("Test generateOTP()", () => {
    const generateOTP = accountServices.generateOTP;
    test('It should return mockOTP', async () => {
        // Mock dependencies
        otpGenerator.generateOTP = jest.fn(() => 'mockOTP');
        const mockDate = new Date(1683022669630)
        const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
        const result = await generateOTP();
        expect(result).toStrictEqual({
            value: 'mockOTP',
            timeCreated: 1683022669630
        });
    })
});

describe("Test register()", () => {
    const register = accountServices.register;
    describe("Test case OK", () => {
        test("It should return mockNewAccount", async () => {
            // Mock dependencies
            const mockEmail = 'mockEmail@gmail.com';
            const mockPassword = 'mockPassword';
            bcrypt.hashSync = jest.fn(() => 'mockEncryptedPassword');
            Account.create = jest.fn(() => 'mockNewAccount');
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => {}),
                rollback: jest.fn(() => {}) 
            });
            // Call test function and expect value
            const result = await register(mockEmail, mockPassword);
            expect(result).toBe('mockNewAccount');      
        });
    });

    describe("Test case NG", () => {
        test("It should throw Error", async () => {
            // Mock dependencies
            const mockEmail = 'mockEmail@gmail.com';
            const mockPassword = 'mockPassword';
            bcrypt.hashSync = jest.fn(() => 'mockEncryptedPassword');
            Account.create = (3/0);
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => {}),
                rollback: jest.fn(() => {}) 
            });
            // Call test function and expect value
            expect(async () => {
                await register(mockEmail, mockPassword);
            }).rejects.toThrowError();
        });
    });
})


