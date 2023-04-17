module.exports = {
    caseOK: {
        mockReq: {
            body: {
                email: 'testValidateAccount@gmail.com',
                password: 'test12345'
            }
        }
    },
    caseNG: {
        mockReq: {
            missingEmail: {
                body: {}
            },
            emptyEmail: {
                body: { email: '' }
            },
            invalidEmail: {
                body: { email: 1234 }
            },
            missingPassword: {
                body: {
                    email: 'testvalidateaccountNG@gmail.com',
                }
            },
            emptyPassword: {
                body: {
                    email: 'testvalidateaccountNG@gmail.com',
                    password: ''
                }
            },
            invalidPassword: {
                body: {
                    email: 'testvalidateaccountNG@gmail.com',
                    password: '123'
                }
            }
        },
        mockRes: {
            missingEmail: {
                status: jest.fn(),    
            }            
        }
    }
}