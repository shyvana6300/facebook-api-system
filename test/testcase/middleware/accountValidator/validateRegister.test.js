const accountValidator = require('../../../../middleware/accountValidator');
const mockValidateAccount = require('../../../mocks/middleware/accountValidator/mockValidateAccount');
const mockReqOK = require('../../../mocks/mockReqCaseOK');
const mockRes = require('../../../mocks/mockResponse');
const connectDB = require("../../../../dbconnector");
jest.useFakeTimers();
// test middleware
const validateRegister = accountValidator.validateRegister;
const accountServices = require("../../../../services/accountServices");
const mockedNext = jest.fn();
// Test validateAccount()
describe("Test the validateAccount", () => {
    
    describe("Test caseOK", () => {
        beforeEach(() => {
            connectDB();
        });
        test("It should call the next() function", async () => {
            accountServices.findAccountByEmail = jest.fn((email) => null);
            const mockedRes = mockRes.CaseOK;
            const result = await validateRegister(mockReqOK, mockedRes, mockedNext);
            expect(mockedNext).toHaveBeenCalled();
        });
    });

});