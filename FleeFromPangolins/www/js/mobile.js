/*jslint browser:true this*/
/*global window StatusBar*/

(function () {
    "use strict";
    document.addEventListener("deviceready", function () {
        window.navigationbar.setUp(true);
        StatusBar.hide();
    });
}());