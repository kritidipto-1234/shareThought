import "@babel/polyfill";

import * as landingPage from "./landingPage.js";
import * as globalPage from "./globalPage.js";
import * as resetPasswordPage from "./resetPasswordPage.js";
import * as myAccountPage from "./myAccountPage.js";
import * as userProfilePage from "./userProfilePage.js";

var viewport = document.querySelector("meta[name=viewport]");
viewport.setAttribute(
    "content",
    viewport.content + ", height=" + window.innerHeight
);

if (
    document.querySelector(".contentContainer").dataset.pagename ===
    "Landing Page"
)
    landingPage.init();

if (
    document.querySelector(".contentContainer").dataset.pagename ===
    "Global Page"
)
    globalPage.init();

if (
    document.querySelector(".contentContainer").dataset.pagename ===
    "Change Password Page"
)
    resetPasswordPage.init();

if (
    document.querySelector(".contentContainer").dataset.pagename ===
    "My Account Page"
)
    myAccountPage.init();

if (
    document.querySelector(".contentContainer").dataset.pagename ===
    "User Profile Page"
)
    userProfilePage.init();
