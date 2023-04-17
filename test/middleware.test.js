const accountValidator = require('../middleware/accountValidator');
// test middleware
describe("Test the accountValidator", () => {
    const validateAccount = accountValidator.validateAccount;
    describe("Test the validateAccount", () => {
        const mockReq = () => {
            const req = {
                body: {
                    email: 'testValidateAccount@gmail.com',
                    password: 'test12345'
                }
            };
            return req;
        };
        const mockRes = () => {
            const res = {};
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            return res;
        }

        test("It should response a json response of data", () => {
            const mockedNext = jest.fn();
            const mockedReq = mockReq();
            const mockedRes = mockRes();
            const result = validateAccount(mockedReq, mockedRes, mockedNext);
            expect(result.email).to.equal('testValidateAccount@gmail.com');
        });
    });
});