const accountValidator = require('../../../middleware/accountValidator');
const accountServices = require('../../../services/accountServices');
const bcrypt = require("bcryptjs");
const schema = require('../../../schema/schema');
jest.useFakeTimers();
// test middleware
const validateAccount = accountValidator.validateAccount;

describe("Test accountValidator", () => {

    // Test validateAccount()
    describe("Test validateAccount()", () => {
        const mockReqNG = require('./mocks/validateAccount/request/mockReqNG');
        const mockReqOK = require('./mocks/validateAccount/request/mockReqOK');
        const mockedNext = jest.fn();
        describe("Test caseOK", () => {
            test("It should call the next() function", () => {
                const mockedRes = jest.fn();
                validateAccount(mockReqOK, mockedRes, mockedNext);
                expect(mockedNext).toHaveBeenCalled();
            });
        });

        // Test case NG
        describe("Test caseNG", () => {

            // Case 1: missing email from request body
            test("It should return error message email required", () => {
                const mockedRes = require('./mocks/validateAccount/response/missingEmail');
                const mockedReq = mockReqNG.missingEmail;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" is required`);
            });
            // Case 2: email in req.body is empty
            test("It should return error message email is empty", () => {
                const mockedRes = require('./mocks/validateAccount/response/emptyEmail');
                const mockedReq = mockReqNG.emptyEmail;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" is not allowed to be empty`);
            });
            // Case 3: invalid email - enter number
            test("It should return error message email must be a string", () => {
                const mockedRes = require('./mocks/validateAccount/response/invalidEmailNumber');
                const mockedReq = mockReqNG.invalidEmailNumber;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" must be a string`);
            });
            // Case 4: invalid email - enter invalid email string
            test("It should return error message email is invalid", () => {
                const mockedRes = require('./mocks/validateAccount/response/invalidEmailString');
                const mockedReq = mockReqNG.invalidEmailFormat;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" must be a valid email`);
            });
            // Case 5: missing password in request body
            test("It should return error message password is required", () => {
                const mockedRes = require('./mocks/validateAccount/response/missingPassword');
                const mockedReq = mockReqNG.missingPassword;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"password" is required`);
            });
            // Case 6: password in request body is a empty string
            test("It should return error message password is empty", () => {
                const mockedRes = require('./mocks/validateAccount/response/emptyPassword');
                const mockedReq = mockReqNG.emptyPassword;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"password" is not allowed to be empty`);
            });
            // Case 7: password in request body is invalid
            test("It should return error message password is invalid", () => {
                const mockedRes = require('./mocks/validateAccount/response/invalidPassword');
                const mockedReq = mockReqNG.invalidPassword;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"password" with value "123" fails to match the required pattern: /^[a-zA-Z0-9]{8,30}$/`);
            });
        });
    });

    // Test validateRegister()
    describe("Test validateRegister()", () => {
        const validateRegister = accountValidator.validateRegister;
        const mockReq = require('./mocks/validateRegister/request/mockReq');
        const mockedNext = jest.fn();
        // Test case OK
        test("It should call the next() function", async () => {
            accountServices.findAccountByEmail = jest.fn((email) => null);
            const mockedRes = jest.fn();
            await validateRegister(mockReq, mockedRes, mockedNext);
            expect(mockedNext).toHaveBeenCalled();
        });
        // Test Case NG 400
        test("It should message that email is exist", async () => {
            accountServices.findAccountByEmail = jest.fn((email) => 'existemail@gmail.com');
            const mockedRes = require('./mocks/validateRegister/response/existEmail');
            await validateRegister(mockReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: "Email has already been used by another account!" });
        });

        // Test Case NG 500
        test("It should message that server error", async () => {
            accountServices.findAccountByEmail = (3 + 2) / 0;
            const mockedRes = require('./mocks/validateRegister/response/serverError');
            await validateRegister(mockReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(500);
            expect(mockedRes.send).toHaveBeenCalledWith({
                message: "Server error!"
            });
        });
    });

    // Test validateLogin()
    describe("Test validateLogin()", () => {
        const validateLogin = accountValidator.validateLogin;
        const mockedReq = require('./mocks/validateRegister/request/mockReq');
        const mockedNext = jest.fn();
        // Case OK
        test("It should call the next() function", async () => {
            accountServices.findAccountByEmail = jest.fn((email) => 'sample result');
            bcrypt.compareSync = jest.fn((reqPassword, accountPassword) => true);
            const mockedRes = jest.fn();
            // Call the test function
            await validateLogin(mockedReq, mockedRes, mockedNext);
            expect(mockedNext).toHaveBeenCalled();
        });

        // Case NG1: account not found
        test("It should return the error message account not found", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn((email) => null);
            const mockedRes = require('./mocks/validateLogin/response/accountNotFound');
            // Call the test function
            await validateLogin(mockedReq, mockedRes, mockedNext);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: "Account not found!" });
        });

        // Case NG2: password not match
        test("It should return the error message invalid password", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn((email) => 'sample result');
            bcrypt.compareSync = jest.fn((reqPassword, accountPassword) => false);
            const mockedRes = require('./mocks/validateLogin/response/passwordNotMatch');
            // Call the test function
            await validateLogin(mockedReq, mockedRes, mockedNext);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: "Invalid password!" });
        })
    });

    // Test validateLoginToken()
    describe("Test validateLoginToken()", () => {
        // init mock dependencies
        const validateLoginToken = accountValidator.validateLoginToken;
        const mockReq = require('./mocks/validateLoginToken/request/mockReq');
        const mockedNext = jest.fn();
        // Case OK
        test("It should call the next() function", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn((email) => 'sample result');
            accountServices.checkExpiredOTP = jest.fn((otp) => true);
            const mockedRes = jest.fn();
            const mockedReq = mockReq.normal;
            // Call the test function
            await validateLoginToken(mockedReq, mockedRes, mockedNext);
            expect(mockedNext).toHaveBeenCalled();
        });

        // Case NG1: account does not exist
        test("It should return the message that account does not exist", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn((email) => null);
            const mockedRes = require('./mocks/validateLoginToken/response/accountNotExist');
            const mockedReq = mockReq.normal;
            // Call the test function
            await validateLoginToken(mockedReq, mockedRes, mockedNext);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: "Account does not exist!" });
        });

        // Case NG2: OTP not exist
        test("It should return the message that otp not exist", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn((email) => ' mock result');
            const mockedReq = mockReq.otpNotExist;
            const mockedRes = require('./mocks/validateLoginToken/response/accountNotExist');
            // Call the test function
            await validateLoginToken(mockedReq, mockedRes, mockedNext);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: "OTP not exist!" });
        });

        // Case NG3: OTP not match
        test("It should return the message that otp or email not match", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn((email) => ' mock result');
            const mockedReq = mockReq.otpNotMatch;
            const mockedRes = require('./mocks/validateLoginToken/response/otpNotMatch');
            // Call the test function
            await validateLoginToken(mockedReq, mockedRes, mockedNext);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: "OTP or email not match!" });
        });

        // Case NG3-2: email not match
        test("It should return the message that otp or email not match", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn((email) => ' mock result');
            const mockedReq = mockReq.emailNotMatch;
            const mockedRes = require('./mocks/validateLoginToken/response/emailNotMatch');
            // Call the test function
            await validateLoginToken(mockedReq, mockedRes, mockedNext);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: "OTP or email not match!" });
        });

        // Case NG4: OTP expired
        test("It should return the message that otp or email not match", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn((email) => ' mock result');
            const mockedReq = mockReq.normal;
            const mockedRes = require('./mocks/validateLoginToken/response/otpExpired');
            accountServices.checkExpiredOTP = jest.fn((otp) => false);
            // Call the test function
            await validateLoginToken(mockedReq, mockedRes, mockedNext);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: "OTP expired! Please login again!" });
        });
    });

    // Test validateEmailForgot()
    describe("Test validateEmailForgot()", () => {
        // init mock dependencies
        const validateEmailForgot = accountValidator.validateEmailForgot;
        const mockedNext = jest.fn();
        const mockedReq = {
            body: {
                email: 'testemail@gmail.com'
            }
        };
        // Case OK
        test("It should call the next() function", async () => {
            // Mock dependencies
            const mockedRes = jest.fn();
            schema.schemaEmailForgot.validate = jest.fn((requestBody) => 'mock result');
            // Call the test function
            await validateEmailForgot(mockedReq, mockedRes, mockedNext);
            expect(mockedNext).toHaveBeenCalled();
        });

        // Case NG: Result error
        test("It should return the message error", async () => {
            // Mock dependencies
            const mockedRes = require('./mocks/validateEmailForgot/response/mockRes');

            schema.schemaEmailForgot.validate = jest.fn();
            schema.schemaEmailForgot.validate.mockReturnValueOnce({
                error: {
                    details: [
                        { message: "error" }
                    ]
                }
            });
            // Call the test function
            await validateEmailForgot(mockedReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith("error");
        });
    });

    // Test validateNewPassword()
    describe("Test validateNewPassword()", () => {
        const validateNewPassword = accountValidator.validateNewPassword
        const mockedNext = jest.fn();
        const mockReq = require('./mocks/validateNewPassword/request/mockReq');
        describe("Test caseOK", () => {
            test("It should call the next() function", () => {
                const mockedRes = jest.fn();
                schema.schemaNewPassword.validate = jest.fn((requestBody) => 'mock result');
                const mockedReq = mockReq.normal;
                validateNewPassword(mockedReq, mockedRes, mockedNext);
                expect(mockedNext).toHaveBeenCalled();
            });
        });

        // test case NG
        describe("Test caseNG", () => {
            // Case 1: error validate
            test("It should return error message", () => {
                const mockedRes = require('./mocks/validateNewPassword/response/validateError');
                const mockedReq = mockReq.normal;
                schema.schemaNewPassword.validate = jest.fn((requestBody) => 'mock result');
                schema.schemaNewPassword.validate = jest.fn();
                schema.schemaNewPassword.validate.mockReturnValueOnce({
                    error: {
                        details: [
                            { message: "error" }
                        ]
                    }
                });
                validateNewPassword(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`error`);
            });

            // Case 2: password confirm not match
            test("It should return error message", () => {
                const mockedRes = require('./mocks/validateNewPassword/response/passwordNotMatch');
                const mockedReq = mockReq.notMatch;
                schema.schemaNewPassword.validate = jest.fn();
                schema.schemaNewPassword.validate.mockReturnValueOnce({
                    error: {
                        details: [
                            { message: "Password confirm not match!" }
                        ]
                    }
                });
                validateNewPassword(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`Password confirm not match!`);
            });

        });
    });

    // Test validateLoginTokenSchema()
    describe("Test validateLoginTokenSchema()", () => {
        // init mock dependencies
        const validateLoginTokenSchema = accountValidator.validateLoginTokenSchema;
        const mockedNext = jest.fn();
        const mockedReq = {
            body: {
                email: 'testemail@gmail.com',
                otp: 'newOTP'
            }
        };
        // Case OK
        test("It should call the next() function", async () => {
            // Mock dependencies
            const mockedRes = jest.fn();
            schema.schemaLoginToken.validate = jest.fn((requestBody) => 'mock result');
            // Call the test function
            validateLoginTokenSchema(mockedReq, mockedRes, mockedNext);
            expect(mockedNext).toHaveBeenCalled();
        });

        // Case NG: Result error
        test("It should return the message error", async () => {
            // Mock dependencies
            const mockedRes = require('./mocks/validateLoginTokenSchema/response/mockRes');

            schema.schemaLoginToken.validate = jest.fn();
            schema.schemaLoginToken.validate.mockReturnValueOnce({
                error: {
                    details: [
                        { message: "error" }
                    ]
                }
            });
            // Call the test function
            validateLoginTokenSchema(mockedReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith("error");
        });
    });
})