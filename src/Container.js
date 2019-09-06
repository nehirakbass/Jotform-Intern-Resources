import React from 'react'
import { Router } from '@reach/router'
import fire from './Firebase/Fire'
import firebase from 'firebase/app'
import Welcome from './Components/Welcome'
import NotFound from './Components/NotFound'
import { connect } from 'react-redux'
import AvailablePage from './Components/AvailablePage';
import AddResourceForm from './Components/AddResourceForm';
import { authGoogleF, authGoogleS } from './Redux/Actions/preLoginActions'
import { setId } from './Redux/Actions/postLoginActions'
import Profile from './Components/Profile'
import InterPage from './Components/InterPage'
import { Loader, Dimmer } from 'semantic-ui-react'
import Single from './Components/Single'

class Container extends React.Component {
    constructor() {
        super()

        this.state = {
            flag: false
        }
    }
    state = {
        ready: false
    };

    authListener = () => {
        const { authGoogleS, authGoogleF } = this.props
        fire.auth().onAuthStateChanged((user) => {
            this.setState({
                ready: true
            });
            if (user) {
                authGoogleS(user.displayName, user.email, user.photoURL)
                const db = fire.firestore()
                 
                db.collection('Users').doc(user.email).get()
                    .then((docSnapShot) => {
                        if(!docSnapShot.data().uTeam && window.location.href.indexOf('get-info') === -1){
                            window.location.href ='/get-info'
                        }
                    })
                this.saveToFire()
            } else {
                authGoogleF()
            }
        })
    }

    saveToFire = () => {
        const { userMail, userName } = this.props

        const db = fire.firestore()
        db.settings({ timestampsInSnapshots: true })

        db.collection("Users").doc(userMail).get()
            .then((docSnapShot) => {
                if (docSnapShot.exists) {
                    return
                } else {
                    db.collection("Users").doc(userMail).set({
                        uName: userName,
                        uMail: userMail,
                        Favourites: []
                    })
                }
            })

        this.setState({ flag: true })
    }

    authGoogle = () => {
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
        fire.auth().signInWithPopup(googleAuthProvider)
    }

    componentDidMount() {
        if (!this.state.flag) {
            this.authListener()
        }
    }

    render() {
        if (!this.state.ready) {
            return <div>
                <Dimmer active>
                    <Loader inline="centered" size='massive'>Loading</Loader>
                </Dimmer>
            </div>
        }
        let content = [];
        if (!this.props.isSuccess) {
            content = <Welcome default path="/" />
        } else {
            content = [
                <AvailablePage path="resources" />,
                <AvailablePage path="/" />,
                <Single path="resources/:id" />,
                <InterPage path="get-info" />,
                <AddResourceForm path="add-resource" />,
                <Profile path="profile" />,
                <NotFound default />
            ]
        }
        return <Router>
            {content}
        </Router>
    }
}
function mapDispatchToProps(dispatch) {
    return {
        authGoogleS: (userName, userMail, userAvatar) => dispatch(authGoogleS(userName, userMail, userAvatar)),
        authGoogleF: () => dispatch(authGoogleF()),
        setId: (id) => dispatch(setId(id))
    }
}

function mapStateToProps(state) {
    return {
        isSuccess: state.preLoginReducers.isSuccess,
        userName: state.preLoginReducers.userName,
        userMail: state.preLoginReducers.userMail,
        position: state.postLoginReducers.position,
        team: state.postLoginReducers.team
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Container)