import firebase from 'firebase'

const fireConfig = {
    apiKey: "AIzaSyCCZ98vuexKnoR7_lEAaJW2WeI1-IY3akU",
    authDomain: "https://jotforminternresources.now.sh",
    databaseURL: "https://jotformproject-1563801277969.firebaseio.com",
    projectId: "jotformproject-1563801277969",
    storageBucket: "jotformproject-1563801277969.appspot.com",
    messagingSenderId: "672809542075",
    appId: "1:672809542075:web:5a653e0a542a3d7e"
}

const fire = firebase.initializeApp(fireConfig)

export default fire
