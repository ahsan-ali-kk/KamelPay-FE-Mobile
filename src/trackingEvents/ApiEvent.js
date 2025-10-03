import RNUxcam from 'react-native-ux-cam';

export const apiErrorLog = (path, payload) => {
    if(payload) {
        let data = {
            "Type": "ERROR",
            path: path,
            ...payload,
            "Date And Time" : new Date().toISOString()
        };
        console.log(data)
        // RNUxcam.logEvent("API", data);
    }
};
