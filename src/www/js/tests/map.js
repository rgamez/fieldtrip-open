/*
Copyright (c) 2015, EDINA
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.
* Neither the name of EDINA nor the names of its contributors may be used to
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

/* global equal, test */

define(['map'], function(map) {
    var wgs84 = {
        lon: -3.18,
        lat: 55.95
    };

    var os = {
        lon: 326409.20,
        lat: 673625.06
    };

    var run = function() {
        module('Map');

        test('point reprojection toInternal {lon,lat}', function() {
            var newOs = map.pointToInternal(wgs84);
            equal(parseFloat(newOs.lon).toFixed(2), os.lon);
            equal(parseFloat(newOs.lat).toFixed(2), os.lat);
        });

        test('point reprojection toInternal {longitude,latitude}', function() {
            var wsg84long = {
                longitude: wgs84.lon,
                latitude: wgs84.lat
            };

            var newOs = map.pointToInternal(wsg84long);
            equal(parseFloat(newOs.longitude).toFixed(2), os.lon);
            equal(parseFloat(newOs.latitude).toFixed(2), os.lat);
        });

        test('point reprojection toInternal [longitude,latitude]', function() {
            var newOs = map.pointToInternal([wgs84.lon, wgs84.lat]);
            equal(parseFloat(newOs.lon).toFixed(2), os.lon);
            equal(parseFloat(newOs.lat).toFixed(2), os.lat);
        });

        test('point reprojection toExternal [lon,lat]', function() {
            var newWgs84 = map.pointToExternal([os.lon, os.lat]);
            equal(parseFloat(newWgs84.lon).toFixed(2), wgs84.lon);
            equal(parseFloat(newWgs84.lat).toFixed(2), wgs84.lat);
        });
    };
    return {run: run};
});
