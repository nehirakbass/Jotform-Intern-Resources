const postLoginReducers = (state = [], action) => {
    switch (action.type) {
        case 'LOG_OUT':
            return
        case 'LOGGED_IN':
            return
        case 'ADDING_RESOURCES':
            return {
                resources: action.resources
            }
        case 'SET_TYPE':
            return {
                sType: action.sType
            }
        case 'SETTING_RES_TYPE':
            return {
                resType: action.rType
            }
        case 'SET_CREDENTIALS':
            return Object.assign({}, state, {
                team: action.team,
                position: action.pos
            })
        case 'SET_ID':
            return Object.assign({}, state, {
                uId: action.id
            })
        case 'SET_SINGLE':
            return Object.assign({}, state , {
                single: action.single
            })
        default:
            return state
    }
}

export default postLoginReducers
