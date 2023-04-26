const accountValidator = require('../../../../middleware/accountValidator');
const mockValidateAccount = require('../../../mocks/middleware/accountValidator/validateAccount/mockReqNG');
const mockReqOK = require('../../../mocks/mockReqCaseOK');
const mockRes = require('../../../mocks/mockResponse');
const connectDB = require('../../../../dbconnector');
const accountServices = require('../../../../services/accountServices');
const bcrypt = require("bcryptjs");
const { expectCt } = require('helmet');
jest.useFakeTimers();
// test middleware
const validateAccount = accountValidator.validateAccount;

describe("Test accountValidator", () => {
    beforeAll(() => {
        connectDB();
    });
    const mockedNext = jest.fn();
    // Test validateAccount()
    describe("Test validateAccount()", () => {
        describe("Test caseOK", () => {
            test("It should call the next() function", () => {
                const mockedRes = jest.fn();
                validateAccount(mockReqOK, mockedRes, mockedNext);
                expect(mockedNext).toHaveBeenCalled();
            });
        });

        // xử lý mock function cho return res.status().send()
        describe("Test caseNG", () => {
            
            // Case 1: missing email from request body
            test("It should return error message email required", () => {
                const mockedRes = require('../../../mocks/middleware/accountValidator/validateAccount/response/missingEmail');
                const mockedReq = mockValidateAccount.missingEmail;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" is required`);
            });
            // Case 2: email in req.body is empty
            test("It should return error message email is empty", () => {
                const mockedRes = require('../../../mocks/middleware/accountValidator/validateAccount/response/emptyEmail');
                const mockedReq = mockValidateAccount.emptyEmail;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" is not allowed to be empty`);
            });
            // Case 3: invalid email - enter number
            test("It should return error message email must be a string", () => {
                const mockedRes = require('../../../mocks/middleware/accountValidator/validateAccount/response/invalidEmailNumber');
                const mockedReq = mockValidateAccount.invalidEmailNumber;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" must be a string`);
            });
            // Case 4: invalid email - enter invalid email string
            test("It should return error message email is invalid", () => {
                const mockedRes = require('../../../mocks/middleware/accountValidator/validateAccount/response/invalidEmailString');
                const mockedReq = mockValidateAccount.invalidEmailFormat;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" ssssssmust be a valid email`);
            });
            // Case 5: missing password in request body
            // test("It should return error message password is required", () => {
            //     const mockedReq = mockValidateAccount.missingPassword;
            //     validateAccount(mockedReq, mockedRes, mockedNext);
            //     expect(mockedRes.status).toHaveBeenCalledWith(400);
            //     expect(mockedRes.send).toHaveBeenCalledWith(`"password" is required`);
            // });
            // Case 6: password in request body is a empty string
            // test("It should return error message password is empty", () => {
            //     const mockedReq = mockValidateAccount.emptyPassword;
            //     validateAccount(mockedReq, mockedRes, mockedNext);
            //     expect(mockedRes.status).toHaveBeenCalledWith(400);
            //     expect(mockedRes.send).toHaveBeenCalledWith(`"password" is not allowed to be empty`);
            // });
            // Case 7: password in request body is invalid
            // test("It should return error message password is empty", () => {
            //     const mockedReq = mockValidateAccount.invalidPassword;
            //     validateAccount(mockedReq, mockedRes, mockedNext);
            //     expect(mockedRes.status).toHaveBeenCalledWith(400);
            //     expect(mockedRes.send).toHaveBeenCalledWith(`"password" with value "123" fails to match the required pattern: /^[a-zA-Z0-9]{8,30}$/`);
            // });
        });
    });

    // Test validateAccount()
    // describe("Test validateRegister()", () => {
    //     const validateRegister = accountValidator.validateRegister;
        // Test case OK
        // test("It should call the next() function", async () => {
        //     accountServices.findAccountByEmail = jest.fn((email) => null);
        //     const mockedRes = mockRes.CaseOK;
        //     await validateRegister(mockReqOK, mockedRes, mockedNext);
        //     expect(mockedNext).toHaveBeenCalled();
        // });
        // Test Case NG 400
        // test("It should message that email is exist", async () => {
        //     accountServices.findAccountByEmail = jest.fn((email) => 'existemail@gmail.com');
        //     const mockedRes = mockRes.CaseNG;
        //     await validateRegister(mockReqOK, mockedRes, mockedNext);
        //     expect(mockedRes.status).toHaveBeenCalledWith(400);
        //     expect(mockedRes.send).toHaveBeenCalledWith({message: "Emailsssssss has already been used by another account!"});
        // });

        // Test Case NG 500
        // test("It should message that server error", async () => {
        //     accountServices.findAccountByEmail = (3+2)/0;
        //     const mockedRes = mockRes.CaseNG;
        //     await validateRegister(mockReqOK, mockedRes, mockedNext);
        //     expect(mockedRes.status).toHaveBeenCalledWith(500);
        //     expect(mockedRes.send).toHaveBeenCalledWith({
        //         message: "Server error!111111"
        //     });
        // });
    // });

    // Test validateLogin()
    // describe("Test validateLogin()", () => {
    //     const validateLogin = accountValidator.validateLogin;
    //     // Case OK
    //     test("It should call the next() function", async () => {
    //         accountServices.findAccountByEmail = jest.fn((email) => 'sample result');
    //         bcrypt.compareSync = jest.fn((reqPassword, accountPassword) => true);
    //         const mockedRes = mockRes.CaseOK;
    //         await validateLogin(mockReqOK, mockedRes, mockedNext);
    //         expect(mockedNext).toHaveBeenCalled();
    //     });

    //     // Case NG1: account not found
    //     test("It should return the error message account not found", async () => {
    //         accountServices.findAccountByEmail = jest.fn((email) => null);
    //         const mockedRes = mockRes.CaseNG;
    //         await validateLogin(mockReqOK, mockedRes, mockedNext);
    //         expect(mockedRes.status).toHaveBeenCalledWith(404);
    //         expect(mockedRes.send).toHaveBeenCalledWith({ message: "Account not found!" });
    //     });

    //     // Case NG2: password not match
    //     test("It should return the error message invalid password", async () => {
    //         accountServices.findAccountByEmail = jest.fn((email) => null);
    //         const mockedRes = mockRes.CaseNG;
    //         await validateLogin(mockReqOK, mockedRes, mockedNext);
    //         expect(mockedRes.status).toHaveBeenCalledWith(404);
    //         expect(mockedRes.send).toHaveBeenCalledWith({ message: "Account not found!" });
    //     })
    // })
})