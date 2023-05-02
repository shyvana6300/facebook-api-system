const activityServices = require("../../services/activityServices");
const baseModel = require("../../models/baseModel");
const Reaction = baseModel.reactionModel;
const Comment = baseModel.commentModel;
const FriendShip = baseModel.friendshipModel;
const Status = baseModel.statusModel;
const schema = require('../../schema/schema');

describe("Test getReport()", () => {
    const getReport = activityServices.getReport;
    describe("Test case OK", () => {
        test("It should return successful message", async () => {
            const mockAccountId = 1;
            const result = await getReport(mockAccountId);
            expect(result).toBe('Create report successful!');
        });
    });
    describe("Test case NG", () => {
        test("It should throw Error", async () => {
            const mockAccountId = (3/0);
            expect(async () => {
                await getReport(mockAccountId);
            }).rejects.toThrowError();
        });
    });
});

describe("Test postStatus()", () => {
    const postStatus = activityServices.postStatus;
    describe("Test case OK", () => {
        test("It should return mockNewStatus", async () => {
            // Mock Dependencies
            const mockAccountId = 'mockAccountId';
            const mockStatusImage = 'mockStatusImage';
            const mockStatusContent = 'mockStatusContent';
            const mockProtocol = 'mockProtocol';
            const mockHost = 'mockHost';
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => { }),
                rollback: jest.fn(() => { })
            });
            Status.create = jest.fn(() => 'mockNewStatus');
            // Call the test function
            const mockNewStatus = await postStatus(mockAccountId, mockStatusImage, mockStatusContent, mockProtocol, mockHost);
            expect(mockNewStatus).toBe('mockNewStatus');
        })
    });

    describe("Test case NG: server error", () => {
        test("It should return mockNewStatus", async () => {
            // Mock Dependencies
            const mockAccountId = 'mockAccountId';
            const mockStatusImage = 'mockStatusImage';
            const mockStatusContent = 'mockStatusContent';
            const mockProtocol = 'mockProtocol';
            const mockHost = 'mockHost';
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => { }),
                rollback: jest.fn(() => { })
            });
            Status.create = (3 / 0);
            // Call the test function
            expect(async () => {
                await postStatus(mockAccountId, mockStatusImage, mockStatusContent, mockProtocol, mockHost);
            }).rejects.toThrowError();
        })
    })
});

describe("Test addComment()", () => {
    const addComment = activityServices.addComment;
    describe("Test case OK", () => {
        test("It should return mockResult", async () => {
            // Mock dependencies
            const mockIdStatus = 'mockIdStatus';
            const mockIdAccount = 'mockIdAccount';
            const mockContent = 'mockContent';
            Comment.create = jest.fn(() => 'mockResult');
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => { }),
                rollback: jest.fn(() => { })
            });
            // Call the test function and expect value
            const result = await addComment(mockIdStatus, mockIdAccount, mockContent);
            expect(result).toBe('mockResult');
        });
    });

    describe("Test case NG", () => {
        test("It should return mockResult", async () => {
            // Mock dependencies
            const mockIdStatus = 'mockIdStatus';
            const mockIdAccount = 'mockIdAccount';
            const mockContent = 'mockContent';
            Comment.create = (3 / 0);
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => { }),
                rollback: jest.fn(() => { })
            });
            // Call the test function and expect value
            expect(async () => {
                await postStatus(mockAccountId, mockStatusImage, mockStatusContent, mockProtocol, mockHost);
            }).rejects.toThrowError();
        });
    });
});

describe("Test validateAddingFriend()", () => {
    const validateAddingFriend = activityServices.validateAddingFriend;
    describe("Test case OK", () => {
        test("It should return mockResult", async () => {
            const mockReq = {
                body: 'mock'
            };
            schema.schemaFriendship.validate = jest.fn((requestBody) => 'mock result');
            const result = await validateAddingFriend(mockReq);
            expect(result).toBe('mock result');
        })
    });

    describe("Test case NG", () => {
        test("It should return mockResult", async () => {
            const mockReq = {
                body: 'mock'
            };
            schema.schemaFriendship.validate = jest.fn();
            schema.schemaFriendship.validate.mockReturnValueOnce({
                error: {
                    details: [
                        { message: "error" }
                    ]
                }
            });
            const result = await validateAddingFriend(mockReq);
            expect(result).toStrictEqual({
                error: true,
                message: "error"
            });
        })
    });
});

describe("Test isFriendShipExist()", () => {
    const isFriendShipExist = activityServices.isFriendShipExist;
    describe("Test case OK: friendship not exist", () => {
        test("It should return false", async () => {
            const mockIdFriend = 'mockIdFriend';
            const mockIdAccount = 'mockIdAccount';
            FriendShip.findOne = jest.fn(() => null);
            const result = await isFriendShipExist(mockIdFriend, mockIdAccount);
            expect(result).toBe(false);
        });
    });

    describe("Test case NG: friendship already exist", () => {
        test("It should return false", async () => {
            const mockIdFriend = 'mockIdFriend';
            const mockIdAccount = 'mockIdAccount';
            FriendShip.findOne = jest.fn(() => 'mockFriendShip');
            const result = await isFriendShipExist(mockIdFriend, mockIdAccount);
            expect(result).toBe(true);
        });
    });
});

describe("Test addFriend()", () => {
    const addFriend = activityServices.addFriend;
    describe("Test case OK", () => {
        test("It should return sucessful message", async () => {
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => { }),
                rollback: jest.fn(() => { })
            });
            const mockIdFriend = 'mockIdFriend';
            const mockIdAccount = 'mockIdAccount';
            FriendShip.create = jest.fn(() => 'mockFriendShip');
            const result = await addFriend(mockIdFriend, mockIdAccount);
            expect(result).toBe("Create friendship successful!");
        })
    });

    describe("Test case NG", () => {
        test("It should throw Error", async () => {
            const mockIdFriend = 'mockIdFriend';
            const mockIdAccount = 'mockIdAccount';
            FriendShip.create = (3 / 0);
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => { }),
                rollback: jest.fn(() => { })
            });
            expect(async () => {
                await addFriend(mockIdFriend, mockIdAccount);
            }).rejects.toThrowError();
        })
    });
});

describe("Test reactStatus()", () => {
    const reactStatus = activityServices.reactStatus;
    describe("Test case OK1: like status", () => {
        test("It should return newReaction", async () => {
            const mockIdStatus = 'mockIdStatus';
            const mockIdReactor = 'mockIdReactor';
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => { }),
                rollback: jest.fn(() => { })
            });
            Reaction.findOne = jest.fn(() => null);
            Reaction.create = jest.fn(() => 'mockNewReaction');
            const result = await reactStatus(mockIdStatus,mockIdReactor);
            expect(result).toBe('mockNewReaction');
        });
    });

    describe("Test case OK2: unlike status", () => {
        test("It should return message unlike successful", async () => {
            const mockIdStatus = 'mockIdStatus';
            const mockIdReactor = 'mockIdReactor';
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => { }),
                rollback: jest.fn(() => { })
            });
            Reaction.findOne = jest.fn(() => 'mockReaction');
            Reaction.destroy = jest.fn();
            const result = await reactStatus(mockIdStatus,mockIdReactor);
            expect(result).toBe('React unlike status successful!');
        });
    });

    describe("Test case NG: server Error", () => {
        test("It should throw error", async () => {
            const mockIdStatus = 'mockIdStatus';
            const mockIdReactor = 'mockIdReactor';
            baseModel.sequelize.transaction = jest.fn();
            baseModel.sequelize.transaction.mockReturnValue({
                commit: jest.fn(() => { }),
                rollback: jest.fn(() => { })
            });
            Reaction.findOne = (3/0);
            expect(async () => {
                await reactStatus(mockIdStatus,mockIdReactor);
            }).rejects.toThrowError();
        });
    });
});

describe("Test getTimeline()", () => {
    const getTimeline = activityServices.getTimeline;
    describe("Test case OK", () => {
        test("It should return result", async () => {
            const mockAccountId = 'mockAccountId';
            const mockLimitParam = 'mockLimitParam';
            const mockOffsetParam = 'mockOffsetParam';
            baseModel.sequelize.query = jest.fn(() => 'mockRecords');
            const result = await getTimeline(mockAccountId, mockLimitParam, mockOffsetParam);
            expect(result).toBe('mockRecords');
        });
    });

    describe("Test case NG", () => {
        test("It should throw Error", async () => {
            const mockAccountId = 'mockAccountId';
            const mockLimitParam = 'mockLimitParam';
            const mockOffsetParam = 'mockOffsetParam';
            baseModel.sequelize.query = (3/0);
            expect(async () => {
                await getTimeline(mockAccountId, mockLimitParam, mockOffsetParam);
            }).rejects.toThrowError();
        });
    });
    

});



