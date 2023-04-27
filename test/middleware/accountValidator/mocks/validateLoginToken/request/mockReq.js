module.exports = {
    normal: {
        body: {
            email: 'testValidateLoginToken@gmail.com',
            otp: 'otp6300'
        },
        session: {
            email: 'testValidateLoginToken@gmail.com',
            otp: {
                value: 'otp6300'
            }
        }
    },
    otpNotExist: {
        body: {
            email: 'testValidateLoginToken@gmail.com',
            otp: 'otp6300'
        },
        session: {
            email: 'testValidateLoginToken@gmail.com'
        }
    },
    otpNotMatch: {
        body: {
            email: 'testValidateLoginToken@gmail.com',
            otp: 'otp6300'
        },
        session: {
            email: 'testValidateLoginToken@gmail.com',
            otp: {
                value: 'otp63002'
            }
        }
    },
    emailNotMatch: {
        body: {
            email: 'testValidateLoginToken@gmail.com',
            otp: 'otp6300'
        },
        session: {
            email: 'testValidateLogi@gmail.com',
            otp: {
                value: 'otp6300'
            }
        }
    }
}