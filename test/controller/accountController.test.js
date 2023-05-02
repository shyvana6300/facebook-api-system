const accountController = require('../../controller/accountController');
const accountServices = require("../../services/accountServices");

describe('Test register', () => {
    const register = accountController.register;
    const mockedReq = {
        body: {
            email: 'mockemail@gmail.com',
            password: 'mockpassword'
        }
    }
    describe('Test case OK', () => {
        test('It should return new account', async () => {
            // Mock dependencies
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            accountServices.register = jest.fn(() => 'mock new account');
            // Call test function
            await register(mockedReq, mockedRes);
            expect(mockedRes.status).toHaveBeenCalledWith(201);
            expect(mockedRes.send).toHaveBeenCalledWith('mock new account');
        })
    });

    describe('Test case NG', () => {
        test('It should return server error message', async () => {
            // Mock dependencies
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            accountServices.register = (3 / 0);
            // Call test function
            await register(mockedReq, mockedRes);
            expect(mockedRes.status).toHaveBeenCalledWith(500);
            expect(mockedRes.send).toHaveBeenCalledWith("Unexpected error occurred when creating new account.");
        })
    });
});

describe('Test loginOTP', () => {
    test('It should return the otp value', async () => {
        const loginOTP = accountController.loginOTP;
        const mockedReq = {
            body: {
                email: 'mockemail@gmail.com',
                password: 'mockpassword'
            },
            session: {}
        }
        const mockedRes = {};
        mockedRes.status = jest.fn().mockReturnValue(mockedRes);
        mockedRes.send = jest.fn().mockReturnValue(mockedRes);
        accountServices.generateOTP = jest.fn();
        accountServices.generateOTP.mockReturnValue({ value: 'mockValue' });
        await loginOTP(mockedReq, mockedRes);
        expect(mockedRes.status).toHaveBeenCalledWith(200);
        expect(mockedRes.send).toHaveBeenCalledWith('Your OTP is: ' + 'mockValue');
    });
});

describe('Test getTokenLogin', () => {
    test('It should return the message logged in successful', () => {
        const getTokenLogin = accountController.getTokenLogin;
        const mockedReq = {
            body: {
                email: 'mockemail@gmail.com',
            },
            session: {}
        }
        accountServices.generateToken = jest.fn();
        accountServices.generateToken.mockReturnValue('mockToken');
        const mockedRes = {};
        mockedRes.status = jest.fn().mockReturnValue(mockedRes);
        mockedRes.send = jest.fn().mockReturnValue(mockedRes);
        getTokenLogin(mockedReq, mockedRes);
        expect(mockedRes.status).toHaveBeenCalledWith(200);
        expect(mockedRes.send).toHaveBeenCalledWith('You has been logged in!');
    })
});

describe('Test forgotPassword', () => {
    test('It should return reset password URL', async () => {
        const forgotPassword = accountController.forgotPassword;
        // Mock dependencies
        const mockedReq = {
            body: {
                email: 'mockEmail@gmail.com'
            },
            protocol: 'http',
            get: jest.fn((arg) => 'mock')
        }
        const mockedRes = {};
        mockedRes.status = jest.fn().mockReturnValue(mockedRes);
        mockedRes.send = jest.fn().mockReturnValue(mockedRes);
        accountServices.generateURLForgetPassword = jest.fn((email, protocol, host) => 'mockURL');
        // Call test function and expect value
        await forgotPassword(mockedReq, mockedRes);
        expect(mockedRes.status).toHaveBeenCalledWith(200);
        expect(mockedRes.send).toHaveBeenCalledWith('mockURL');
    });
});

describe('Test resetPassword', () => {
    // Mock init 
    const resetPassword = accountController.resetPassword;
    const mockedReq = {
        email: 'mockEmail@gmail.com',
        body: {
            newPassword: 'mockNewPassword'
        },
        session: {
            tokenLogin: 'mockToken'
        }
    }
    // Test case OK
    describe('Test case OK', () => {
        test('It should return message udate password successful', async () => {
            // Mock dependencies
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            accountServices.findAccountByEmail = jest.fn((args) => 'mockAccount');
            accountServices.resetPassword = jest.fn((email, password) => 1);
            // Call the test function
            await resetPassword(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(200);
            expect(mockedRes.send).toHaveBeenCalledWith('Your password has been updated!');
        })
    });
    // Test case NG 404
    describe('Test case NG: 404', () => {
        test('It should return message account does not exist', async () => {
            // Mock dependencies
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            accountServices.findAccountByEmail = jest.fn((args) => null);
            // Call the test function
            await resetPassword(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: 'Account does not exist!' });
        })
    });

    // Test case NG 500
    describe('Test case NG: 500', () => {
        test('It should return message server error', async () => {
            // Mock dependencies
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            accountServices.findAccountByEmail = (3/0);
            // Call the test function
            await resetPassword(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(500);
            expect(mockedRes.send).toHaveBeenCalledWith({
                message: "Error reset password for account " + mockedReq.email
            });
        })
    });
});

describe('Test updateProfile', () => {
    // Mock init 
    const updateProfile = accountController.updateProfile;
    const mockedReq = {
        email: 'mockEmail@gmail.com',
    }
    // Test case OK
    describe('Test case OK', () => {
        test('It should return message udate profile successful', async () => {
            // Mock dependencies
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            accountServices.findAccountByEmail = jest.fn((args) => 'mockAccount');
            accountServices.updateProfile = jest.fn((args) => 1);
            // Call the test function
            await updateProfile(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(200);
            expect(mockedRes.send).toHaveBeenCalledWith('Your profile has been updated!');
        })
    });
    // Test case NG 404
    describe('Test case NG: 404', () => {
        test('It should return message account does not exist', async () => {
            // Mock dependencies
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            accountServices.findAccountByEmail = jest.fn((args) => null);
            // Call the test function
            await updateProfile(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: 'Account does not exist!' });
        })
    });

    // Test case NG 500
    describe('Test case NG: 500', () => {
        test('It should return message server error', async () => {
            // Mock dependencies
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            accountServices.findAccountByEmail = (3/0);
            // Call the test function
            await updateProfile(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(500);
            expect(mockedRes.send).toHaveBeenCalledWith({
                message: "Error when update profile for account " + mockedReq.email,
            });
        })
    });
});