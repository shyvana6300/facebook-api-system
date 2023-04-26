const accountValidator = require('../../../../middleware/accountValidator');
const mockValidateAccount = require('../../../mocks/middleware/accountValidator/mockValidateAccount');
const mockReqOK = require('../../../mocks/mockReqCaseOK');
const mockRes = require('../../../mocks/mockResponse');
jest.useFakeTimers();
// test middleware
const validateAccount = accountValidator.validateAccount;

// Test validateAccount()
describe("Test the validateAccount", () => {
    describe("Test caseOK", () => {
        const mockedNext = jest.fn();
        test("It should call the next() function", () => {
            const mockedRes = mockRes.CaseOK;
            validateAccount(mockReqOK, mockedRes, mockedNext);
            expect(mockedNext).toHaveBeenCalled();
        });
    });

    // xử lý mock function cho return res.status().send()
    describe("Test caseNG", () => {
        const mockedNext = jest.fn();
        const mockedRes = mockRes.CaseNG;
        // Case 1: missing email from request body
        test("It should return error message email required", () => {
            const mockedReq = mockValidateAccount.missingEmail;
            validateAccount(mockedReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith(`"email" is required`);
        });
        // Case 2: email in req.body is empty
        test("It should return error message email is empty", () => {
            const mockedReq = mockValidateAccount.emptyEmail;
            validateAccount(mockedReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith(`"email" is not allowed to be empty`);
        });
        // Case 3: invalid email - enter number
        test("It should return error message email must be a string", () => {
            const mockedReq = mockValidateAccount.invalidEmailNumber;
            validateAccount(mockedReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith(`"email" must be a string`);
        });
        // Case 4: invalid email - enter invalid email string
        test("It should return error message email is invalid", () => {
            const mockedReq = mockValidateAccount.invalidEmailFormat;
            validateAccount(mockedReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith(`"email" must be a valid email`);
        });
        // Case 5: missing password in request body
        test("It should return error message password is required", () => {
            const mockedReq = mockValidateAccount.missingPassword;
            validateAccount(mockedReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith(`"password" is required`);
        });
        // Case 6: password in request body is a empty string
        test("It should return error message password is empty", () => {
            const mockedReq = mockValidateAccount.emptyPassword;
            validateAccount(mockedReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith(`"password" is not allowed to be empty`);
        });
        // Case 7: password in request body is invalid
        test("It should return error message password is empty", () => {
            const mockedReq = mockValidateAccount.invalidPassword;
            validateAccount(mockedReq, mockedRes, mockedNext);
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith(`"password" with value "123" fails to match the required pattern: /^[a-zA-Z0-9]{8,30}$/`);
        });
    });
});