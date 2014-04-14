/**
 * Defines the repository models for the application
 */

define(['./module'], function (model) {
    'use strict';

    // Repository Schema
    model.factory('Repository', function(db) {
        var schema = new db.Schema({
            title:{ type: String, required: true, unique: true },
            url:{ type: String, required: true }
        });


        // Instantiating the repository model instance
        return db.model('repository', schema);
    });

    // Secure Store Schema
    model.factory('SecureStore', function(db) {
        var schema = new db.Schema({
            username:{ type: String, required: true },
            password:{ type: String, required: true },
           
        });

        return db.model('secureStore', schema);
    });
});
