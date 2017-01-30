// Copyright (c) 2016, the M-Transform.js project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
/*jslint node: true*/
"use strict";

function Rule(condition, body) {
    if (!(this instanceof Rule)) { return new Rule(condition, body); }

    if (condition === undefined) { throw new Error('missing condition function'); }
    if (typeof condition !== 'function') { throw new Error('invalid condition function'); }
    if (body === undefined) { throw new Error('missing body function'); }
    if (typeof body !== 'function') { throw new Error('invalid body function'); }

    this.condition = condition;
    this.body = body;
}

Rule.prototype.invoke = function () {
    if (this.condition.apply(null, arguments)) {
        return this.body.apply(null, arguments);
    }
};

// Helpers
Rule.always = function () { return true; };
Rule.never = function () { return false; };

module.exports = Rule;
