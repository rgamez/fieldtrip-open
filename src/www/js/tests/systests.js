/*
Copyright (c) 2014, EDINA.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this
   list of conditions and the following disclaimer in the documentation and/or
   other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software must
   display the following acknowledgement: This product includes software
   developed by the EDINA.
4. Neither the name of the EDINA nor the names of its contributors may be used to
   endorse or promote products derived from this software without specific prior
   written permission.

THIS SOFTWARE IS PROVIDED BY EDINA ''AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL EDINA BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
DAMAGE.
*/

"use strict";

/* global asyncTest, equal, ok, start */

define(['QUnit', 'map'], function(QUnit, map) {
    var INTERVAL_POLL = 200;
    var changePageCheck = function(id, cb){
        var count = 0;
        var timer = setInterval(function() {
            if(count > 15){
                console.error(id + " not found");
                clearInterval(timer);
                ok(false, id + " not found");
                cb();
            }
            else if('#' + $($.mobile.activePage).attr('id') === id){
                clearInterval(timer);
                if(cb){
                    cb();
                }
            }
            else{
                console.debug('Waiting for ' + id);
            }

            ++count;
        }, INTERVAL_POLL);
    };

    var changePageByFile = function(page, target, cb){
        $.mobile.changePage(page);
        return changePageCheck(target, cb);
    };

    var clickAndTest = function(options){
        var delay = 0; // delay before doing click
        if(typeof(options.delay) !== 'undefined'){
            delay = options.delay;
        }

        setTimeout(function(){
            $(options.id).click();
            intervalTest(options);
        }, delay);
    };

    var goHome = function(cb){
        changePageByFile('index.html', '#home-page', cb);
    };

    var goToMap = function(cb){
        changePageByFile('map.html', '#map-page', cb);
    };

    var intervalTest = function(options){
        var count = 0; // running count of attempts
        var attempts = 20; // max number of attempts
        var poll = INTERVAL_POLL; // poll interval between attempts

        if(typeof(options.attempts) !== 'undefined'){
            attempts = options.attempts;
        }
        if(typeof(options.poll) !== 'undefined'){
            poll = options.poll;
        }

        var timer = setInterval(function() {
            if(options.test()){
                ok(true, 'Element ' + options.id + ' found');
                clearInterval(timer);
                options.cb(true);
            }
            else{
                if(count > attempts){
                    ok(false, 'Timeout for ' + options.id);
                    clearInterval(timer);
                    options.cb(false);
                }
                else{
                    console.debug('Waiting for ' + options.id);
                    ++count;
                }
            }
        }, poll);
    };

    var tests = {
        'Geo Locate': function(){
            goToMap(function(){
                var LON = 0;
                var LAT = 0;
                var lonlat = new OpenLayers.LonLat(LON, LAT);
                var ng = map.toInternal(lonlat);
                map.updateLayer({
                    layer: map.getLocateLayer(),
                    id: map.USER_POSITION_ATTR,
                    zoom: map.POST_LOCATE_ZOOM_TO,
                    lonLat: ng
                });
                equal(Math.round(map.getLocateCoords().lon), lonlat.lon, 'Locate lon position reset');
                equal(Math.round(map.getLocateCoords().lat), lonlat.lat, 'Locate lat position reset');

                // click on locate and test if position changes
                map.geolocateTimeout = 2000;
                $('.user-locate').click();
                var timer = setInterval(function() {
                    lonlat = map.getLocateCoords();
                    if(lonlat.lon !== LON && lonlat.lat !== LAT){
                        ok(true, 'Geo Position located');
                        clearInterval(timer);
                        start();
                    }
                }, INTERVAL_POLL);
            });
        },
        'test two': function(){
            ok(true, 'Geo Position located');
            start();
        }
    };

    var run = function() {
        module("System Tests");
        $.each(tests, function(name, test){
            asyncTest(name, test);
        });
    };

return {
    tests: tests,
    run: run,
    clickAndTest: function(options){
        clickAndTest(options);
    },
    changePageCheck: function(id, cb){
        changePageCheck(id, cb);
    },
    goToMap: function(cb){
        goToMap(cb);
    },
    goToTestPage: function(cb){
        goHome(function(){
            var id = '#test-page';
            $.mobile.changePage(id);
            changePageCheck(id, cb);
        });
    },
    intervalTest: function(options){
        intervalTest(options);
    },

};

});