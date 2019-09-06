import React from 'react'
import fire from '../Firebase/Fire'
import firebase from 'firebase/app'
import 'firebase/auth'
import gLogin from '../Assets/g-button.svg'
import InterPage from './InterPage'
import { connect } from 'react-redux'

class SignIn extends React.Component {
    authGoogle = () => {
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
        fire.auth().signInWithPopup(googleAuthProvider)
    }

    render() {
        if (this.props.isSuccess) {
            return <InterPage />
        } else {
            return <div className="login">
                <img src={gLogin} onClick={this.authGoogle} />
            </div>
        }
    }
}

function mapStateToProps(state) {
    return {
        isSuccess: state.preLoginReducers.isSuccess
    }
}

export default connect(mapStateToProps, null)(SignIn)