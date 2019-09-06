export const authGoogleS = (userName,userMail,userAvatar) => {
    return { type: 'GOOGLE_SUCCESS', userName, userMail, userAvatar}
}

export const authGoogleF = () => {
    return { type: 'GOOGLE_FAILED'}
}