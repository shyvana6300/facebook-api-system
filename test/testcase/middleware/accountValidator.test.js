const accountValidator = require('../../../middleware/accountValidator');
const mockValidateAccount = require('../../mocks/middleware/accountValidator/mockValidateAccount');

// test middleware
describe("Test the accountValidator", () => {
    const validateAccount = accountValidator.validateAccount;
    describe("Test the validateAccount", () => {
        describe("Test caseOK", () => {
            test("It should call the next() function", () => {
                const mockedNext = jest.fn();
                const mockedReq = mockValidateAccount.caseOK.mockReq;
                const mockedRes = jest.fn();
                const result = validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedNext).toHaveBeenCalled();
            });
        });

        // xử lý mock function cho return res.status().send()
        describe("Test caseNG", () => {
            const mockedNext = jest.fn();
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Case 1: missing email from request body
            test("It should return error message email required", () => {
                const mockedReq = mockValidateAccount.caseNG.mockReq.missingEmail;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" is required`);
            });
            // Case 2: email in req.body is empty
            test("It should return error message email is empty", () => {
                const mockedReq = mockValidateAccount.caseNG.mockReq.emptyEmail;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" is not allowed to be empty`);
            });
            // Case 3: invalid email - enter number
            test("It should return error message email must be a string", () => {
                const mockedReq = mockValidateAccount.caseNG.mockReq.invalidEmailNumber;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" must be a string`);
            });
            // Case 4: invalid email - enter invalid email string
            test("It should return error message email is invalid", () => {
                const mockedReq = mockValidateAccount.caseNG.mockReq.invalidEmailFormat;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" must be a valid email`);
            });
            // Case 5: missing password in request body
            test("It should return error message password is required", () => {
                const mockedReq = mockValidateAccount.caseNG.mockReq.missingPassword;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.send).toHaveBeenCalledWith(`"password" is required`);
            });
            // Case 6: password in request body is a empty string
            test("It should return error message password is empty", () => {
                const mockedReq = mockValidateAccount.caseNG.mockReq.emptyPassword;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.send).toHaveBeenCalledWith(`"password" is not allowed to be empty`);
            });
            // Case 7: password in request body is invalid
            test("It should return error message password is empty", () => {
                const mockedReq = mockValidateAccount.caseNG.mockReq.invalidPassword;
                validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.send).toHaveBeenCalledWith(`"password" with value "123" fails to match the required pattern: /^[a-zA-Z0-9]{8,30}$/`);
            });
        });
    });
});