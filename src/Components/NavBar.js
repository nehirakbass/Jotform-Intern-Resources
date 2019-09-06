import React from 'react'
import { connect } from 'react-redux'
import * as preLoginActionCrators from '../Redux/Actions/preLoginActions'
import { bindActionCreators } from 'redux'
import Welcome from './Welcome'
import firebase from 'firebase'
import { Link } from '@reach/router'

class NavBar extends React.Component {
    logOut = () => {
        const { authGoogleF } = this.props
        firebase.auth().signOut().then(() => {
            authGoogleF()
        })
    }

    render() {
        if (this.props.isLoggedIn === false) {
            return <Welcome to="/" />
        } else {
            return <div className="navBar">
                <div className="navBar-col first">
                    <Link className="link" to="/resources" >Available Resources</Link>
                    <Link className="link" to="/add-resource" >Suggest a Resource</Link>
                </div>
                <a href="https://www.jotform.com" className="navBar-logo"/>
                <div className="navBar-col second">
                    <Link className="link" to="/profile">{this.props.userName}</Link>
                    <Link className="link" to="/" onClick={this.logOut}>Log out</Link>
                </div>
                <div className="homePage" />
            </div>
        }
    }
}

function mapStateToProps(state) {
    return {
        userName: state.preLoginReducers.userName
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(preLoginActionCrators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)