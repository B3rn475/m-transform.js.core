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
        return _.last;
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

function toPairs(object) {
    return _.toPairs(object);
}

function makeReducer(compacters) {
    var mapValue = function (zip, property) {
        var values = _.map(zip, 1);
        if (compacters[property]) {
            return compacters[property](values);
        }
        return values;
    };
    return function (values) {
        return _.chain(values)
            .map(toPairs)
            .flatten()
            .groupBy(0)
            .mapValues(mapValue)
            .value();
    };
}

function Reducer(config) {
    if (config !== undefined && typeof config !== 'object') {
        throw new Error('invalid configuration');
    }
    var compacters = _.mapValues(config || {}, makeCompacter);
    return makeReducer(compacters);
}

module.exports = Reducer;
