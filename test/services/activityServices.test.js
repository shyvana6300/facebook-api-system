const activityServices = require("../../services/activityServices");
const baseModel = require("../../models/baseModel");
const QueryTypes = baseModel.sequelize.QueryTypes;
const Reaction = baseModel.reactionModel;
const Comment = baseModel.commentModel;
const FriendShip = baseModel.friendshipModel;
const Status = baseModel.statusModel;
const schema = require('../../schema/schema');
const Op = baseModel.Sequelize.Op;

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
                commit: jest.fn(() => {}),
                rollback: jest.fn(() => {})
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
                commit: jest.fn(() => {}),
                rollback: jest.fn(() => {}) 
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
                commit: jest.fn(() => {}),
                rollback: jest.fn(() => {}) 
            });
            // Call the test function and expect value
            const result = await addComment(mockIdStatus, mockIdAccount, mockContent);
            expect(result).toBe('mockResult');
        })
    })
});