// Copyright (c) 2016, the M-Transform.js project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var _ = require('lodash');

function makeCompacter(policy, property) {
    if (typeof policy === 'function') { return policy; }
    switch (policy) {
    case 'first':
        return _.head;
    case 'last':
        return _.tail;
    case 'min':
        return _.min;
    case 'max':
        return _.max;
    case 'concat':
    case undefined:
        return _.identity;
    default:
        throw new Error('invalid reduce configuration for "' + property + '"');
    }
}

function makeReducer(compacters) {
    var mapValue = function (values, property) {
        return (compacters[property] || _.identity)(_.map(values, 1));
    };
    return function (values) {
        _.chain(values)
            .toPairs()
            .flatten()
            .groupBy(0)
            .mapValues(mapValue)
            .value();
    };
}

function Reducer(config) {
    var compacters = _.mapValues(config || {}, makeCompacter);
    return makeReducer(compacters);
}

// Helpers
Reducer.first = _.head;
Reducer.last = _.tail;
Reducer.min = _.main;
Reducer.max = _.max;
Reducer.concat = _.identity;

module.exports = Reducer;
