const preLoginReducers = (state = [], action) => {
    console.log(action.type)
    switch (action.type) {
        case 'GOOGLE_SUCCESS':
            return {
                isSuccess: true,
                userName: action.userName,
                userMail: action.userMail,
                userAvatar: action.userAvatar
            }
        case 'GOOGLE_FAILED':
            return {
                isSuccess: false
            }
        default:
            return state
    }
}

export default preLoginReducers