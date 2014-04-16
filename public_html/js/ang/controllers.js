'use strict';
/* Controllers */

angular.module('AppleHotel.controllers', []).
        controller('activitiesCTRL', function($scope, $window, $http, $modal, $rootScope) {
            ga('send', 'pageview', {
                'page': 'Activities Page',
                'title': 'Activities'
            });

            $('.metroFilters').click(function() {
                var item = $(this).text();
                console.log(item);
                ga('send', 'event', 'Activities', 'filter clicked', item);
            });
            $scope.items = [];
            $scope.BI = [];
            $scope.apikey = '79ae59a1e073e9b6b9ac862c3be5caaa';
            $scope.call = 'http://api.v1.trippinin.com/GeoSearch/';

            $scope.tab = 'insight';

            $(function() {

                jsKeyboard.init("virtualKeyboard");

                $('#virtualKeyboard').hide();
                $('.keyboardClose').hide();

                $('input').click(function() {
                    $('#virtualKeyboard').show();
                    $('.keyboardClose').show();

                });

                $('.keyboardClose').click(function() {
                    $('#virtualKeyboard').hide();
                    $('.keyboardClose').hide();
                });

                $('#virtualKeyboard').click(function() {
                    $scope.$apply(function() {
                        $scope.activitiesFilter = $('#activitysearch').val();
                    });
                    console.log("change worked");
                });
            });

            $window.navigator.geolocation.getCurrentPosition(
                    function(position) {
                        $scope.cord = position.coords;
                        var cord = position.coords;
                        $scope.surroundings = $scope.call + cord.latitude + ',' + cord.longitude + '/outdoor/saturday/evening?KEY=' + $scope.apikey;
                        var realCall = $scope.surroundings + '&radius=5000&limit=20';
                        $scope.makeCall(realCall + '&offset=10');
                        $scope.makeCall(realCall + '&offset=30');
                        $scope.makeCall(realCall + '&offset=50');
                    }


            );

            $scope.makeCall = function(call) {
                $.ajax({
                    type: 'GET',
                    url: call,
                    success: function(result) {
                        result.response.data.forEach(
                                function(element) {
                                    console.log(element);
                                    $scope.$apply(function() {
                                        $scope.items.push(element);
                                    });
                                });
                    },
                    dataType: 'json'
                });

            };

            var getSocialInfo = function(POI) {
                $scope.apicall = 'http://api.v1.trippinin.com/resolve/' + POI.title + '?coordinates=' + POI.latitude + ',' + POI.longitude + '&KEY=' + $scope.apikey;
                $scope.max = 10;
                var query = $scope.cord.latitude + ',' + $scope.cord.longitude + '+to+' + POI.latitude + ',' + POI.longitude;

                $rootScope.qrcode = 'https://maps.google.com/maps?q=' + encodeURIComponent(query);
                $rootScope.maplink = 'https://maps.google.com/maps?q=' + query;

                $http.get($scope.apicall).success(function(data) {

                    $rootScope.siteTarget = data.response.data;
                    $rootScope.placeRating = data.response.data.rating;
                    console.log($rootScope.siteTarget);

                });
            };





            $scope.open = function(tar) {
                ga('send', 'event', 'Activities', 'Activity clicked', tar.title);
                ga('send', 'pageview', {
                    'page': 'Activity Modal',
                    'title': 'Activity Modal'
                });

                getSocialInfo(tar);

                var modalInstance = $modal.open({
                    templateUrl: 'partials/modals/activitiesModal.html',
                    controller: ModalInstanceCtrl

                });

                modalInstance.result.then(function() {
                    console.log('first call');
                },
                        function() {
                            console.log('second call');
                            ga('send', 'pageview', {
                                'page': 'Activities Page',
                                'title': 'Activities'
                            });
                        }
                );


                $scope.dir = function() {
                };



            };

            var ModalInstanceCtrl = function($scope, $modalInstance, $rootScope) {
                $scope.modalPivot = '';
                $scope.mailSent = '';
                var getDirection = function() {
                    $("#maps").gmap3();
                    $("#maps").gmap3('clear');



                    $("#maps").gmap3(
                            {
                                getroute: {
                                    options: {
                                        origin: [$scope.cord.latitude, $scope.cord.longitude],
                                        destination: [$scope.siteTarget.latitude, $scope.siteTarget.longitude],
                                        travelMode: google.maps.DirectionsTravelMode.TRANSIT
                                    },
                                    callback: function(results) {
                                        if (!results)
                                            return;
                                        $(this).gmap3({
                                            directionsrenderer: {
                                                container: $('#directions'),
                                                options: {
                                                    directions: results
                                                }
                                            }
                                        });
                                    }
                                },
                                autofit: {}
                            }
                    );
                };


                $scope.goDirections = function() {
                    $scope.modalPivot = 'directions';


                    navigator.geolocation.getCurrentPosition(findLocation);


                    function findLocation(position) {
                        $scope.$apply(function() {
                            $scope.cord = position.coords;
                        });
                        getDirection();
                    }
                    ;




                }



                var m = new mandrill.Mandrill('C7LDjR0CdMlYzu12b4zGEg');

// create a variable for the API call parameters
                $scope.params = {
                    "message": {
                        "from_email": "Sales@metroclick.com"
                    }
                };
                $scope.sendTheMail = function() {
// Send the email!
                    $scope.params.message.to = [{"email": $('#userEmail').val()}];
                    $scope.params.message.text = "Thank you for registering with us the link to the map for your mobile phone is " + $scope.maplink;
                    $scope.params.message.autotext = true;


                    m.messages.send($scope.params, function(res) {
                        console.log(res);
                        $scope.$apply(function() {

                            $scope.mailSent = true;
                            $scope.userEmail;

                        })
                    }, function(err) {
                        console.log(err);
                        $scope.mailSent = true;
                    });
                };

                $scope.ok = function() {
                    $log.info('scope.ok');
                    $modalInstance.close($scope.selected.item);

                };

                $scope.cancel = function() {
                    $log.info('scope.cancel');
                    $modalInstance.dismiss('cancel');


                };


            };


        }).controller('couponsEventsCTRL', function($scope) {


    $scope.open = function(tar) {

        $scope.siteTarget = tar;
        $scope.shouldBeOpen = true;
    };
    $scope.close = function() {

        $scope.shouldBeOpen = false;
    };
    $scope.opts = {
        backdropFade: true,
        dialogFade: true
    };
}).controller('newsCTRL', function($scope, newsFeed, $modal) {
    ga('send', 'pageview', {
        'page': 'News Page',
        'title': 'News'
    });


    $scope.feedSrc = 'http://rss.cnn.com/rss/cnn_topstories.rss';

    newsFeed.parseFeed($scope.feedSrc).then(function(res) {

        console.log(res.data.responseData.feed.entries);
        $scope.feeds = res.data.responseData.feed.entries;
    });
    $scope.open = function(tar) {
        ga('send', 'event', 'News', 'news article clicked', tar.title);
        ga('send', 'pageview', 'News Modal');
        console.log(tar);
        var modalInstance = $modal.open({
            templateUrl: 'partials/modals/newsModal.html',
            controller: ModalInstanceCtrl,
            resolve: {
                article: function() {
                    return tar;
                }
            }

        });

        modalInstance.result.then(function() {
            console.log('first call');
        },
                function() {
                    console.log('second call');
                    ga('send', 'pageview', {
                        'page': 'News Page',
                        'title': 'News'
                    });
                }
        );

    };
    var ModalInstanceCtrl = function($scope, $modalInstance, article) {
        $scope.emailSent = '';

        var m = new mandrill.Mandrill('C7LDjR0CdMlYzu12b4zGEg');


// create a variable for the API call parameters
        var params = {
            "message": {
                "from_email": "Sales@metroclick.com",
                "to": [{"email": $('#usermail').val()}],
                "subject": "Mobile Directions",
                "text": "I'm learning the Mandrill API at Codecademy."
            }
        };
        $scope.sendTheMail = function(link) {

            console.log(link);
// Send the email!
            params.message.to = [{"email": $('#usermail').val()}];
            params.message.text = "Thank you for registering with us the link to the map for your mobile phone is " + link;
            params.message.autotext = true;


            m.messages.send(params, function(res) {
                console.log(res);
                $scope.$apply(function() {

                    $scope.clientEmail = '';
                    $scope.emailSent = 'sent'

                })

            }, function(err) {
                console.log(err);
            });
        }


        $scope.articles = article;
        $scope.ok = function() {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };

    };

}).controller("weatherCTRL", function($scope, $window) {
    ga('send', 'pageview', {
        'page': 'Weather Page',
        'title': 'Weather'
    });
    $scope.url = "http://api.wunderground.com/api/80cc3c5c83621a9a/forecast/q/New_York/New_York.json";

    $scope.forecasts = "";
    $.ajax({
        url: $scope.url,
        dataType: "jsonp",
        success: function(parsed_json) {
            console.log(parsed_json);
            $scope.weather = parsed_json;
            $scope.$apply(function() {

                $scope.forecasts = $scope.weather.forecast.simpleforecast.forecastday;
                $scope.textforcasts = $scope.weather.forecast.txt_forecast.forecastday;


                angular.forEach($scope.forecasts, function(value) {

                    var high = parseInt(value.high.fahrenheit);
                    var low = parseInt(value.low.fahrenheit);
                    console.log(value.currentTemperature);
                    value.currentTemperature = (high + low) / 2;
                    console.log(value.currentTemperature);



                });

            });
        }
    });

}).controller('flightsCTRL', function($scope, $http) {
    ga('send', 'pageview', {
        'page': 'Flights Page',
        'title': 'Flights'
    });
    $('.metroFilters').click(function() {
        var item = $(this).text();
        console.log(item);
        ga('send', 'event', 'Flights', 'filter clicked', item);
    });
    $scope.flightControl = "arriving";
    var fxml_url = 'http://danadadush:607b262a53cf87a774e09402a2e9d0cc0cc5cbbc@flightxml.flightaware.com/json/FlightXML2/';

    $(function() {

        jsKeyboard.init("virtualKeyboard");

        $('#virtualKeyboard').hide();
        $('.keyboardClose').hide();

        $('input').click(function() {
            $('#virtualKeyboard').show();
            $('.keyboardClose').show();

        });

        $('.keyboardClose').click(function() {
            $('#virtualKeyboard').hide();
            $('.keyboardClose').hide();
        });


        $('#virtualKeyboard').click(function() {
            $scope.$apply(function() {
                $scope.Flightfilter = $('#flightsearch').val();
            });
            console.log("change worked");
        });

    });

    $.ajax({
        type: 'GET',
        url: fxml_url + 'Scheduled',
        data: {'airport': 'JFK', 'howMany': 14, 'offset': 0},
        success: function(result) {
            // display some textual details about the flight.
            console.log(result.ScheduledResult.scheduled);
            $scope.departing = result.ScheduledResult.scheduled;
        },
        error: function(data, text) {
            console.log(data, text);
        },
        dataType: 'jsonp',
        jsonp: 'jsonp_callback',
        xhrFields: {withCredentials: true}
    });

    $.ajax({
        type: 'GET',
        url: fxml_url + 'Enroute',
        data: {'airport': 'JFK', 'howMany': 14, 'offset': 0},
        success: function(result) {
            // display some textual details about the flight.

            $scope.$apply(function() {
                $scope.arriving = result.EnrouteResult.enroute;
            });
            console.log(result.EnrouteResult.enroute);
        },
        error: function(data, text) {
            console.log(data, text);
        },
        dataType: 'jsonp',
        jsonp: 'jsonp_callback',
        xhrFields: {withCredentials: true}
    });


    $('#flightsearch').on('change keypress paste focus textInput input', function() {
        $scope.$apply(function() {

            $scope.search = $('#flightsearch').val();

        });
        console.log($('#flightsearch').val());
    });

}
)

        .controller('dinningCTRL', function($scope, $http, $window, $modal, $rootScope, storage) {
            ga('send', 'pageview', {
                'page': 'Dining page',
                'title': 'Dining'
            });
            $('.metroFilters').click(function() {
                var item = $(this).text();
                console.log(item);
                ga('send', 'event', 'Dining', 'filter clicked', item);
            });

            $scope.items = [];
            $scope.BI = [];
            $scope.apikey = '79ae59a1e073e9b6b9ac862c3be5caaa';
            $scope.call = 'http://api.v1.trippinin.com/GeoSearch/';

            $scope.tab = 'insight';


            $(function() {


                jsKeyboard.init("virtualKeyboard");

                $('#virtualKeyboard').hide();
                $('.keyboardClose').hide();

                $('input').click(function() {
                    $('#virtualKeyboard').show();
                    $('.keyboardClose').show();

                });

                $('.keyboardClose').click(function() {
                    $('#virtualKeyboard').hide();
                    $('.keyboardClose').hide();
                });

                $('#virtualKeyboard').click(function() {
                    $scope.$apply(function() {
                        $scope.diningFilter = $('#inputfilter').val();
                    });
                    console.log("change worked");
                });

            });
            if (!storage.get('dinningPlaces')) {
                $window.navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.cord = position.coords;

                    var cord = position.coords;

                    var surroundings = $scope.call + cord.latitude + ',' + cord.longitude + '/eat/saturday/evening?KEY=' + $scope.apikey;

                    var realCall = surroundings + '&radius=1000&limit=20';


                    makeCall(realCall);
                    makeCall(realCall + '&offset=20');
                    makeCall(realCall + '&offset=40');




                });
            } else {
                console.log('used storage');


                $scope.items = storage.get('dinningPlaces');


            }


            var makeCall = function(call) {


                $.ajax({
                    type: 'GET',
                    url: call,
                    success: function(result) {
                        // display some textual details about the flight.

                        result.response.data.forEach(function(element) {

                            getSocialInfo(element);

                        });

                        console.log();
                    },
                    dataType: 'json'
                });

            };

            var getSocialInfo = function(POI) {

                console.log('making social');
                var apicall = 'http://api.v1.trippinin.com/resolve/' + POI.title + '?coordinates=' + POI.latitude + ',' + POI.longitude + '&KEY=' + $scope.apikey;
                $scope.siteTarget;
                var query = $scope.cord.latitude + ',' + $scope.cord.longitude + '+to+' + POI.latitude + ',' + POI.longitude;

                POI.qrcode = 'https://maps.google.com/maps?q=' + encodeURIComponent(query);
                POI.maplink = 'https://maps.google.com/maps?q=' + encodeURIComponent(query);

                $.ajax({
                    type: 'GET',
                    url: apicall,
                    success: function(result) {
                        // display some textual details about the flight.

                        POI.metroSocial = result.response.data;


                        $scope.$apply(function() {

                            $scope.items.push(POI);
                            storage.set('dinningPlaces', $scope.items);
                            console.log('saved');
                        });
                    },
                    dataType: 'json'
                });






            };


            $scope.open = function(tar) {
                ga('send', 'event', 'Dining', 'dining location clicked', tar.title);
                ga('send', 'pageview', {
                    'page': 'Dining Modal',
                    'title': 'Dining Modal'
                });

                var modalInstance = $modal.open({
                    templateUrl: 'partials/modals/diningModal.html',
                    controller: ModalInstanceCtrl,
                    resolve: {
                        item: function() {
                            return tar;
                        }
                    }

                });

                modalInstance.result.then(function() {
                    console.log('first call');
                },
                        function() {
                            console.log('second call');
                            ga('send', 'pageview', {
                                'page': 'Dining Page',
                                'title': 'Dining'
                            });
                        }
                );

            };//open

            var ModalInstanceCtrl = function($scope, $modalInstance, item) {

                $scope.location = item.metroSocial;
                $scope.modalPivot = '';
                $scope.mailSent = '';
                var getDirection = function() {
                    $("#maps").gmap3();
                    $("#maps").gmap3('clear');



                    $("#maps").gmap3(
                            {
                                getroute: {
                                    options: {
                                        origin: [$scope.cord.latitude, $scope.cord.longitude],
                                        destination: [$scope.location.latitude, $scope.location.longitude],
                                        travelMode: google.maps.DirectionsTravelMode.TRANSIT
                                    },
                                    callback: function(results) {
                                        if (!results)
                                            return;
                                        $(this).gmap3({
                                            directionsrenderer: {
                                                container: $('#directions'),
                                                options: {
                                                    directions: results
                                                }
                                            }
                                        });
                                    }
                                },
                                autofit: {}
                            }
                    );
                };//getDirections


                $scope.goDirections = function() {
                    $scope.modalPivot = 'directions';


                    navigator.geolocation.getCurrentPosition(findLocation);


                    function findLocation(position) {
                        $scope.$apply(function() {
                            $scope.cord = position.coords;
                        });
                        getDirection();
                    }
                    ;//findLocation




                };//goDirections



                var m = new mandrill.Mandrill('C7LDjR0CdMlYzu12b4zGEg');

// create a variable for the API call parameters
                $scope.params = {
                    "message": {
                        "from_email": "Sales@metroclick.com",
                        "to": [{"email": $scope.userEmail}],
                        "subject": "Mobile Directions",
                        "text": "I'm learning the Mandrill API at Codecademy."
                    }
                };
                $scope.sendTheMail = function() {
// Send the email!
                    $scope.params.message.to = [{"email": $('#userEmail').val()}];
                    $scope.params.message.text = "Thank you for registering with us the link to the map for your mobile phone is " + $scope.maplink;
                    $scope.params.message.autotext = true;


                    m.messages.send($scope.params, function(res) {
                        console.log(res);
                        $scope.$apply(function() {

                            $scope.mailSent = true;
                            $scope.userEmail;

                        });
                    }, function(err) {
                        console.log(err);
                        $scope.mailSent = true;
                    });
                };

                $scope.ok = function() {
                    ga('send', 'pageview', {
                        'page': 'Activities Page',
                        'title': 'Activities'
                    });
                    $modalInstance.close($scope.selected.item);
                }; //OKAY

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                }; //CANCEL
            }; //Var ModalInstanceCtrl

            $scope.close = function() {

                $scope.shouldBeOpen = false;

            }; //Close

        })

        .controller('transportation', function($scope, $window, $http, $modal, $timeout) {

            ga('send', 'pageview', {
                'page': 'Transportation page',
                'title': 'Transportation'
            });
            var directionsDisplay;
            var directionsService = new google.maps.DirectionsService();
            var map;

            function calcRoute(start, finish) {
                var request = {
                    origin: start,
                    destination: finish,
                    travelMode: google.maps.DirectionsTravelMode.TRANSIT
                };

                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {

                        directionsDisplay.setDirections(response);
                    }
                });
            } //End Calc Route


            $(function() {

                $window.navigator.geolocation.getCurrentPosition(function(position) {
                    directionsDisplay = new google.maps.DirectionsRenderer();
                    var cord = position.coords;
                    var mapOptions = {
                        center: new google.maps.LatLng(cord.latitude, cord.longitude),
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        draggable: true
                    };

                    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                    directionsDisplay.setMap(map);

                    directionsDisplay.setPanel(document.getElementById('directions-panel'));

                    var acOptions = {
                        types: []
                                //Gives all options by default
                    };

                    var input = document.getElementById('search');

                    var autocomplete = new google.maps.places.Autocomplete(input, acOptions);
                    autocomplete.bindTo('bounds', map);

                    var infoWindow = new google.maps.InfoWindow();

                    var markerOptions = {
                        position: new google.maps.LatLng(cord.latitude, cord.longitude),
                        animation: google.maps.Animation.DROP,
                        icon: new google.maps.MarkerImage(
                                "img/home-2.png",
                                new google.maps.Size(32, 37, "px", "px")
                                )
                    };
                    var marker = new google.maps.Marker(markerOptions);
                    marker.setMap(map);

                    google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        infoWindow.close();

                        $timeout(function() {
                            $('#search').getkeyboard().close();

                        }, 800);
                        var place = autocomplete.getPlace();
                        if (place.geometry.viewport) {
                            map.fitBounds(place.geometry.viewport);


                        } else {

                            map.setCenter(place.geometry.location);
                            map.setZoom(14);
                        }

                        calcRoute(new google.maps.LatLng(cord.latitude, cord.longitude), place.geometry.location);

                        $("#directions-panel").animate({height: '300px', opacity: 1});
                        $("#MobDirButton").animate({opacity: 1});
                        //$("#map-canvas").animate({width: "54.4%"});
                        var query = cord.latitude + ',' + cord.longitude + '+to+' + encodeURIComponent(place.geometry.location);
                        console.log(place.geometry.location);
                        $scope.$apply(function() {
                            $scope.qrcode = 'https://maps.google.com/maps?q=' + encodeURIComponent(query);
                            $scope.maplink = 'https://maps.google.com/maps?q=' + query;
                        });
                        console.log($scope.qrcode);

                    });


                }); //End getCurrent Position

            }); //END $function()

            /********** NIKKI'S MODAL CODE STARTS HERE *************
             * Modal is complete except for CSS, which is upcoming.
             * This is being called from transportation.html.
             *******************************************************/
            $scope.open = function() { //Note: This instantly uses the ModalInstanceCtrl
                console.log("I should be opening the modal here.")
                var modalInstance = $modal.open({
                    templateUrl: 'partials/modals/transportModal.html',
                    controller: ModalInstanceCtrl,
                    resolve: {
                        qrcode: function() {
                            return $scope.qrcode;
                        },
                        maplink: function() {
                            return $scope.maplink;
                        }
                    }
                });
                console.log("The modal should have been opened by now.")
            }; //end open ()

            /**** HANDLES THIS PARTICULAR MODAL *****/
            var ModalInstanceCtrl = function($scope, $modalInstance, $rootScope, maplink, qrcode) {
                $scope.modalPivot = '';
                $scope.mailSent = '';
                var m = new mandrill.Mandrill('C7LDjR0CdMlYzu12b4zGEg');

                /*** CREATE A VARIABLE TO CALL API PARAMETERS ***/
                $scope.params = {
                    "message": {
                        "from_email": "Sales@metroclick.com",
                        "to": [{"email": $scope.userEmail}],
                        "subject": "Mobile Directions",
                        "text": "I'm learning the Mandrill API at Codecademy."
                    }
                }; //Params

                /*** SEND THE EMAIL ***/
                $scope.sendTheMail = function() {

                    $scope.params.message.to = [{"email": $('#userEmail').val()}];
                    $scope.params.message.text = "Thank you for registering with us the link to the map for your mobile phone is " + maplink;
                    $scope.params.message.autotext = true;

                    m.messages.send($scope.params, function(res) {
                        console.log(res);
                        $scope.$apply(function() {
                            $scope.mailSent = true;
                            $scope.userEmail;

                        });
                    }, function(err) {
                        console.log(err);
                        $scope.mailSent = true;
                    });
                }; //sendTheMail

                $scope.ok = function() {
                    $modalInstance.close($scope.selected.item);
                }; //OK

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                }; //CANCEL

            }; //VAR MODALINSTANCECTRL

            $scope.close = function() {
                $scope.shouldBeOpen = false;
            }; //CLOSE

            /**** NIKKI'S MODAL CODE ENDS HERE *****/

        }).controller('backMechanism', function($scope, $location) {
    ga('send', 'pageview', {
        'page': 'Main Page',
        'title': 'Main Page'
    });

    $scope.showback = $location.path() === '/home';


    $(document).idle({
        onIdle: function() {
            $scope.$apply(function() {
                ga('send', 'pageview', 'idle view');
                $location.path('/home');

            });
        },
        idle: 120000
    });


    $scope.$on('$routeChangeSuccess', function() {

        $scope.showback = $location.path() === '/home';
    });

});