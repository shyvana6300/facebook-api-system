module.exports = {
        missingEmail: {
            body: {}
        },
        emptyEmail: {
            body: { email: '' }
        },
        invalidEmailNumber: {
            body: { email: 1234 }
        },
        invalidEmailFormat: {
            body: { email: 's' }
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
        },
        accountExist: {
            body: {
                email: 'shyvana63001@gmail.com',
                password: 'test12345'
            }
        }
}