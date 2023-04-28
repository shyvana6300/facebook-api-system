module.exports = {
    normal: {
        body: {
            newPassword: 'mockpassword',
            passwordConfirm: 'mockpassword'
        }
    },
    notMatch: {
        body: {
            newPassword: 'mockpassword',
            passwordConfirm: 'mockpassword1x'
        }
    }
    
}