const activityServices = require("../../services/activityServices");
const accountServices = require("../../services/accountServices");
const activityController = require('../../controller/activityController');
const connectDB = require('../../dbconnector');

describe("Test postStatus()", () => {
    // Mock init
    const mockedReq = {
        email: 'mockEmail@gmail.com',
        file: 'mockFile',
        body: {
            content: 'mockContent',
            protocol: 'http',
            
        },
        get: jest.fn((arg) => 'mockGet')
    }
    const postStatus = activityController.postStatus;
    describe("Test case OK", () => {
        beforeAll(() => {
            connectDB();
        });
        test('It should return the result', async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn(() => 'mock Account');
            activityServices.postStatus = jest.fn(() => 'mockResult');
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call the test function
            await postStatus(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(201);
            expect(mockedRes.send).toHaveBeenCalledWith('mockResult');
        });
        



    });

    describe("Test case NG 404", () => {
        test('It should return the result', async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn(() => null);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call the test function
            await postStatus(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: 'Account does not exist!' });
        });
    });

    describe("Test case NG 500", () => {
        test('It should return the result', async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = (3/0);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call the test function
            await postStatus(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(500);
            expect(mockedRes.send).toHaveBeenCalledWith("Unexpected error occurred when creating new status.");
        });
    });
});

describe("Test addComment()", () => {
    const addComment = activityController.addComment;
    const mockedReq = {
        email: 'mockEmail@gmail.com',
        body: {
            idStatus: 'mockIdStatus',
            content: 'mockContent'
        },
    }
    describe("Test case OK", () => {
        test("It should return the result", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn(() => 'mockAccount');
            activityServices.getStatusById = jest.fn(() => 'mockStatusId');
            activityServices.addComment = jest.fn(() => 'mockResult');
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addComment(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(201);
            expect(mockedRes.send).toHaveBeenCalledWith('mockResult');
        })
    });

    describe("Test case NG: 404 Account does not exist", () => {
        test("It should return the mesage that account does not exist", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn(() => null);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addComment(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: 'Account does not exist!' });
        })
    });

    describe("Test case NG: 404 Status does not exist", () => {
        test("It should return the error message that status does not exist", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn(() => 'mockAccount');
            activityServices.getStatusById = jest.fn(() => null);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addComment(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith('Status does not exist!');
        })
    });

    describe("Test case NG: 500", () => {
        test("It should return the result", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = (3/0);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addComment(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(500);
            expect(mockedRes.send).toHaveBeenCalledWith("Unexpected error occurred when adding new comment.");
        })
    });
});

describe("Test reactStatus()", () => {
    const reactStatus = activityController.reactStatus;
    const mockedReq = {
        email: 'mockEmail@gmail.com',
        body: {
            idStatus: 'mockIdStatus'
        },
    }
    describe("Test case OK", () => {
        test("It should return result", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn(() => 'mockAccount');
            activityServices.getStatusById = jest.fn(() => 'mockStatusId');
            activityServices.reactStatus = jest.fn(() => 'mockResult');
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await reactStatus(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(201);
            expect(mockedRes.send).toHaveBeenCalledWith('mockResult');
        });
    });

    describe("Test case NG: 404 Account does not exist", () => {
        test("It should return the mesage that account does not exist", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn(() => null);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await reactStatus(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: 'Account does not exist!' });
        })
    });

    describe("Test case NG: 404 Status does not exist", () => {
        test("It should return the error message that status does not exist", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn(() => 'mockAccount');
            activityServices.getStatusById = jest.fn(() => null);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await reactStatus(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith('Status does not exist!');
        })
    });

    describe("Test case NG: 500", () => {
        test("It should return the result", async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = (3/0);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await reactStatus(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(500);
            expect(mockedRes.send).toHaveBeenCalledWith("Unexpected error occurred when react status.");
        })
    });
});

describe("Test addFriend()", () => {
    const addFriend = activityController.addFriend;
    const mockedReq = {
        email: 'mockEmail@gmail.com',
        body: {
            idFriend: 4
        },
    }
    describe("Test case OK", () => {
        test("It should return result", async () => {
            // Mock dependencies
            activityServices.validateAddingFriend = jest.fn(() => 'mockValidateResult');
            accountServices.findAccountByEmail = jest.fn(() => 'mockAccount');
            accountServices.getAccountById = jest.fn(() => 'mockFriendAccount');
            activityServices.isFriendShipExist = jest.fn(() => false);
            activityServices.addFriend = jest.fn(() => 'mockResult')
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addFriend(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(201);
            expect(mockedRes.send).toHaveBeenCalledWith('mockResult');
        });
    });

    describe("Test case NG: 500 Server error", () => {
        test("It should return message notify error", async () => {
            // Mock dependencies
            activityServices.validateAddingFriend = (3/0);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addFriend(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(500);
            expect(mockedRes.send).toHaveBeenCalledWith("Unexpected error occurred while adding friend.");
        });
    });

    describe("Test case 404: validate Error", () => {
        test("It should return message error", async () => {
            // Mock dependencies
            activityServices.validateAddingFriend = jest.fn();
            activityServices.validateAddingFriend.mockReturnValue({
                error: true,
                message: 'validateError'
            })
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addFriend(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith('validateError');
        });
    });

    describe("Test case 404: Account does not exist", () => {
        test("It should return message account does not exist", async () => {
            // Mock dependencies
            activityServices.validateAddingFriend = jest.fn(() => 'mockValidateResult');
            accountServices.findAccountByEmail = jest.fn(() => null);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addFriend(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: 'Account does not exist!' });
        });
    });

    describe("Test case 404: friend Account does not exist", () => {
        test("It should return message friend account does not exist", async () => {
            // Mock dependencies
            activityServices.validateAddingFriend = jest.fn(() => 'mockValidateResult');
            accountServices.findAccountByEmail = jest.fn(() => 'mockAccount');
            accountServices.getAccountById = jest.fn(() => null);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addFriend(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith('Friend account does not exist!');
        });
    });

    describe("Test case NG: 400 account id = friend id ", () => {
        test("It should return message cannot add friend with yourself", async () => {
            // Mock dependencies
            activityServices.validateAddingFriend = jest.fn(() => 'mockValidateResult');
            accountServices.findAccountByEmail = jest.fn();
            accountServices.findAccountByEmail.mockReturnValue({
                id: 4
            })
            accountServices.getAccountById = jest.fn(() => 'mockAccount');
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addFriend(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith('Cannot add friend with yourself!');
        });
    });

    describe("Test case 400", () => {
        test("It should return erorr message friendship exist", async () => {
            // Mock dependencies
            activityServices.validateAddingFriend = jest.fn(() => 'mockValidateResult');
            accountServices.findAccountByEmail = jest.fn(() => 'mockAccount');
            accountServices.getAccountById = jest.fn(() => 'mockFriendAccount');
            activityServices.isFriendShipExist = jest.fn(() => true);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call test function
            await addFriend(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(400);
            expect(mockedRes.send).toHaveBeenCalledWith('Already are friend!');
        });
    });
});

describe("Test getTimeline()", () => {
    const getTimeline = activityController.getTimeline;
    const mockedReq = {
        email: 'mockEmail@gmail.com',
        query: {
            limit: 'mockLimit',
            offset: 'mockOffset'
        }
    }
    describe("Test case OK", () => {
        test("It should return result", async () => {
            accountServices.findAccountByEmail = jest.fn(() => 'mock Account');
            activityServices.getTimeline = jest.fn(() => 'mockResult');
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call the test function
            await getTimeline(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(200);
            expect(mockedRes.send).toHaveBeenCalledWith('mockResult');
        });
        
    });

    describe("Test case NG 404", () => {
        test('It should return the result', async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn(() => null);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call the test function
            await getTimeline(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: 'Account does not exist!' });
        });
    });

    describe("Test case NG 500", () => {
        test('It should return the message Server error', async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = (3/0);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call the test function
            await getTimeline(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(500);
            expect(mockedRes.send).toHaveBeenCalledWith("Unexpected error occurred when getting timeline.");
        });
    });
});

describe("Test getTimeline()", () => {
    const getReport = activityController.getReport;
    const mockedReq = {
        email: 'mockEmail@gmail.com'
    }
    describe("Test case OK", () => {
        test("It should return result", async () => {
            accountServices.findAccountByEmail = jest.fn(() => 'mock Account');
            activityServices.getReport = jest.fn(() => 'mockResult');
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call the test function
            await getReport(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(201);
            expect(mockedRes.send).toHaveBeenCalledWith('mockResult');
        });
        
    });

    describe("Test case NG 404", () => {
        test('It should return the error message account not exist', async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = jest.fn(() => null);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call the test function
            await getReport(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(404);
            expect(mockedRes.send).toHaveBeenCalledWith({ message: 'Account does not exist!' });
        });
    });

    describe("Test case NG 500", () => {
        test('It should return the message Server error', async () => {
            // Mock dependencies
            accountServices.findAccountByEmail = (3/0);
            const mockedRes = {};
            mockedRes.status = jest.fn().mockReturnValue(mockedRes);
            mockedRes.send = jest.fn().mockReturnValue(mockedRes);
            // Call the test function
            await getReport(mockedReq, mockedRes);
            // Expect value
            expect(mockedRes.status).toHaveBeenCalledWith(500);
            expect(mockedRes.send).toHaveBeenCalledWith("Unexpected error occurred when create report.");
        });
    });
});


