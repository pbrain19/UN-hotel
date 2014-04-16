'use strict';

/* Filters */

angular.module('AppleHotel.filters', []).
        filter('encodeURIComponent', function() {
            return window.encodeURIComponent;
        })
        .filter('decodeURIComponent', function() {
            return window.decodeURIComponent;
        }).filter('iconName', function() {
    return function(input) {
        console.log(String(input).substring(31));
        return String(input).substring(31); // just to see something...
    };
}).filter('cleanContent', function() {
    return function(input) {
 

        return String(input).substring(0, String(input).indexOf("<")); // just to see something...
    };
});