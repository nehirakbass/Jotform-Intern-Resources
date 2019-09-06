import {combineReducers} from 'redux'
import postLoginReducers from './postLoginReducers'
import preLoginReducers from './preLoginReducers'

export default combineReducers({
    postLoginReducers,
    preLoginReducers
})
