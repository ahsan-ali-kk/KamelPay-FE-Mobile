import firebase from '@react-native-firebase/app';

const RNfirebaseConfig = {
    apiKey: "AIzaSyClQ1koz2_hRVGC3Xve72nRzyW8K5pWfM0",
    authDomain: "kamelpay-2a233.firebaseapp.com",
    projectId: "kamelpay-2a233",
    storageBucket: "kamelpay-2a233.appspot.com",
    messagingSenderId: "117055733058",
    appId: "1:117055733058:web:b04d03f71435a471955cdb",
};

firebase.initializeApp(RNfirebaseConfig);

// const androidConfig = {
//     clientId: '117055733058-d75p7kf93sl590rnurvvfsnr0c3dq2hf.apps.googleusercontent.com',
//     appId: '1:117055733058:android:4685039aeefa6ec5955cdb',
//     apiKey: 'AIzaSyClQ1koz2_hRVGC3Xve72nRzyW8K5pWfM0',
//     databaseURL: 'https://kamelpay-2a233-default-rtdb.firebaseio.com',
//     storageBucket: 'kamelpay-2a233.appspot.com',
//     messagingSenderId: '117055733058',
//     projectId: 'kamelpay-2a233',

//     // enable persistence by adding the below flag
//     persistence: true,
// };
// firebase.initializeApp(androidConfig);



// import firebase from 'react-native-firebase';

const getToken = async () => {
    try {
        const token = await firebase.messaging().getToken();
        if (token) return token;
    } catch (error) {
        console.log(error);
    }
};

const getFCMToken = async () => {
    try {
        const authorized = await firebase.messaging().hasPermission();
        const fcmToken = await getToken();

        if (authorized) return fcmToken;

        await firebase.messaging().requestPermission();
        return fcmToken;
    } catch (error) {
        console.log(error);
    }
};

export { getFCMToken };
