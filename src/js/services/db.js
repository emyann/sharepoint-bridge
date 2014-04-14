define(['./module'], function(services) {
    'use strict';

    services.factory('db', [
        function() {

            var tungus = require('tungus');
            var mongoose = require('mongoose');


            var isWin = /^win/.test(process.platform);
            var isMac = /^darwin/.test(process.platform);
            var isLinux32 = /^linux/.test(process.platform);
            var isLinux64 = /^linux64/.test(process.platform);

            var os = "unknown";
            if (isWin)
                os = "win";
            if (isMac)
                os = "mac";
            if (isLinux32)
                os = "linux32";
            if (isLinux64)
                os = "linux64";
            var dbPath="";
            if (os === "win") {
                
                 dbPath = process.env.APPDATA+"\\sharepoint-bridge\\data";
                
                // Establish the database connection
                mongoose.connect('tingodb://' + dbPath, function(err) {
                    // if we failed to connect, abort
                    if (err) throw err;
                });

                console.log("Creating/opening database in folder", dbPath);
            }else{
                console.log("OS " + os + " not supported");
            }


            return mongoose;
        }
    ]);
});
