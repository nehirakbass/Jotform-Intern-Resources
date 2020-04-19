import firebase from 'firebase'

const fireConfig = {
    apiKey: ********************,
    authDomain: ********************,
    databaseURL: ********************,
    projectId: ********************,
    storageBucket: ********************,
    messagingSenderId: ********************,
    appId: ********************
}

const fire = firebase.initializeApp(fireConfig)

export default fire
