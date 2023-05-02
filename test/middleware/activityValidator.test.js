const activityValidator = require('../../middleware/activityValidator');
const schema = require('../../schema/schema');
jest.useFakeTimers();

describe("Test activityValidator", () => {
    describe("Test vlidatePostStatus()", () => {
        const validatePostStatus = activityValidator.validatePostStatus;
        const mockedNext = jest.fn();
        describe("Test case OK", () => {
            test("It should return error message email required", () => {
                const mockedReq = {
                    file: 'test file',
                    body: {
                        content: 'test content'
                    }
                };
                const mockedRes = jest.fn();
                validatePostStatus(mockedReq, mockedRes, mockedNext);
                expect(mockedNext).toHaveBeenCalled();
            })
        });

        describe("Test case NG", () => {
            test("It should return error message", () => {
                const mockedReq = {
                    file: null,
                    body: {
                        content: null
                    }
                };
                const mockedRes = {};
                mockedRes.status = jest.fn().mockReturnValue(mockedRes);
                mockedRes.send = jest.fn().mockReturnValue(mockedRes);
                validatePostStatus(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith({
                    message: "Please enter content or image!"
                });
            });


        });


    });

    describe("Test validateComment()", () => {
        const validateComment = activityValidator.validateComment;
        const mockedNext = jest.fn();
        const mockedReq = {
            body: {
                content: 'content',
            idStatus: 3
            }
        };
        describe("Test case OK", () => {
            schema.schemaComment.validate = jest.fn((requestBody) => 'mock result');
            const mockedRes = jest.fn();
            test("It should call the next() function", () => {
                validateComment(mockedReq, mockedRes, mockedNext);
                expect(mockedNext).toHaveBeenCalled();
            })
        });

        describe("Test case NG", () => {
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);

            test("It should return call res.status and res.send error", () => {
                schema.schemaComment.validate = jest.fn();
                schema.schemaComment.validate.mockReturnValueOnce({
                    error: {
                        details: [
                            { message: "error" }
                        ]
                    }
                });
                // Call the test function
                validateComment(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith("error");
            })
        });
    });

    describe("Test validateReaction()", () => {
        const validateReaction = activityValidator.validateReaction;
        const mockedNext = jest.fn();
        const mockedReq = {
            body: {
                idStatus: 3
            }
        };
        describe("Test case OK", () => {
            schema.schemaReaction.validate = jest.fn((requestBody) => 'mock result');
            const mockedRes = jest.fn();
            test("It should call the next() function", () => {
                validateReaction(mockedReq, mockedRes, mockedNext);
                expect(mockedNext).toHaveBeenCalled();
            })
        });

        describe("Test case NG", () => {
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);

            test("It should return call res.status and res.send error", () => {
                schema.schemaReaction.validate = jest.fn();
                schema.schemaReaction.validate.mockReturnValueOnce({
                    error: {
                        details: [
                            { message: "error" }
                        ]
                    }
                });
                // Call the test function
                validateReaction(mockedReq, mockedRes, mockedNext);
                expect(mockedRes.status).toHaveBeenCalledWith(400);
                expect(mockedRes.send).toHaveBeenCalledWith("error");
            })
        });
    });

})