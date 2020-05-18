import firebase from 'firebase/app';
import 'firebase/storage';

var config = {
    apiKey:'AIzaSyB4_PxvbSoSkJTlC_6M77hEBLw0mLFRwiM',
    authDomain:'react-img-cropper.firebaseapp.com',
    databaseURL:'https://react-img-cropper.firebaseio.com',
    projectId:'react-img-cropper',
    storageBucket:'gs://react-img-cropper.appspot.com/',
    messagingSenderId:'657632625844'
}

firebase.initializeApp(config);

var storage = firebase.storage();

export {storage,firebase as default}