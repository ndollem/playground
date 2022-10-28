import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
import { getRemoteConfig, fetchAndActivate, getValue } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-remote-config.js";

const firebaseConfig = {
    apiKey: "AIzaSyDGt_EBulRPrTRA5fyA8mTJy4oyu-bxXYE",
    authDomain: "kly-all-vertical.firebaseapp.com",
    projectId: "kly-all-vertical",
    storageBucket: "kly-all-vertical.appspot.com",
    messagingSenderId: "1031270433652",
    appId: "1:1031270433652:web:ecaa223f7397c59bca6221",
    measurementId: "G-YV9LXF9F74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const remoteConfig = getRemoteConfig(app);

remoteConfig.settings = {
    fetchTimeMillis: 60000,
    minimumFetchIntervalMillis: 30000
}
fetchAndActivate(remoteConfig);

//load necessary modul to window object
window.fbase = {
    app: app,
    analytics: analytics,
    remoteConfig: remoteConfig,
    logEvent: (key, val) => {
        return logEvent(analytics, key, val)
    },
    getValue: (paramName) => {
        return getValue(remoteConfig, paramName);
    }
}