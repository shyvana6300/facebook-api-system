const accountValidator = require('../../../../middleware/accountValidator');
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
    beforeEach(() => {
        connectDB();
    });
    test("It should call the next() function", async () => {
        accountServices.findAccountByEmail = jest.fn((email) => null);
        const mockedRes = mockRes.CaseOK;
        await validateRegister(mockReqOK, mockedRes, mockedNext);
        expect(mockedNext).toHaveBeenCalled();
    });

    test("It should message that email is exist", async () => {
        accountServices.findAccountByEmail = jest.fn((email) => 'existemail@gmail.com');
        const mockedRes = mockRes.CaseNG;
        await validateRegister(mockReqOK, mockedRes, mockedNext);
        expect(mockedRes.status).toHaveBeenCalledWith(400);
        expect(mockedRes.send).toHaveBeenCalledWith("Email has already been used by another account!");
    });
});