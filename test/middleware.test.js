const accountValidator = require('../middleware/accountValidator');
const mockValidateAccount = require('./mocks/middleware/accountValidator/mockValidateAccount');

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
            test("It should return error message email required", () => {
                const mockedNext = jest.fn();
                const mockedReq = mockValidateAccount.caseNG.mockReq.missingEmail;
                const mockedRes = {}
                mockedRes.status = jest.fn().mockReturnValue(mockedRes);
                mockedRes.send = jest.fn().mockReturnValue(mockedRes);
                const result = validateAccount(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.send).toHaveBeenCalledWith(`"email" is required`);
            });
        });
    });
});