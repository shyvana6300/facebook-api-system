const response = {};

// Create mock response for case OK
response.CaseOK = jest.fn();

// Create mock response for case NG 
const caseNG = {};
caseNG.status = jest.fn().mockReturnValue(caseNG);
caseNG.send = jest.fn().mockReturnValue(caseNG);
response.CaseNG = caseNG;

module.exports = response;