const otpGenerator = require("otp-generator");
const otpGen = require('../../utils/otpGenerator');
describe("Test generateOTP", () => {
    const generateOTP = otpGen.generateOTP;
    test("It should return result", () => {
        otpGenerator.generate = jest.fn(() => 'mockResult');
        const result = generateOTP();
        expect(result).toBe('mockResult');
    })
})