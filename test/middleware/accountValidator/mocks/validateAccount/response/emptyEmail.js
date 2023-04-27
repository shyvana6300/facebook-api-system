const caseNG = {};
caseNG.status = jest.fn().mockReturnValue(caseNG);
caseNG.send = jest.fn().mockReturnValue(caseNG);

module.exports = caseNG;