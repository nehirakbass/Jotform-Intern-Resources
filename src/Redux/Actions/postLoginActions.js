export const handleLogout = () => {
    return { type: 'LOG_OUT' }
}

export const handleLogin = () => {
    return { type: 'LOGGED_IN' }
}

export const setSearchType = (sType) => {
    return { type: 'SET_TYPE', sType }
}

export const addResources = (resources) => {
    return { type: 'ADDING_RESOURCES', resources }
}

export const setResType = (rType) => {
    return { type: 'SETTING_RES_TYPE', rType }
}

export const setCreds = (team,pos) => {
    return { type: 'SET_CREDENTIALS', team, pos }
}

export const setId = (id) => {
    return { type: 'SET_ID', id }
}

export const setSingle = (single) => {
    return { type: 'SET_SINGLE' , single }
}