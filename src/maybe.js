"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sums_up_1 = require("sums-up");
var Maybe = /** @class */ (function (_super) {
    __extends(Maybe, _super);
    function Maybe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Maybe.of = function (t) {
        return Just(t);
    };
    Maybe.fromNullable = function (t) {
        return t ? Just(t) : Nothing();
    };
    Maybe.prototype.map = function (f) {
        return this.caseOf({
            Nothing: function () { return Nothing(); },
            Just: function (data) { return Just(f(data)); }
        });
    };
    Maybe.prototype.flatMap = function (f) {
        return this.caseOf({
            Nothing: function () { return Nothing(); },
            Just: function (data) { return f(data); }
        });
    };
    return Maybe;
}(sums_up_1["default"]));
exports.Maybe = Maybe;
function Nothing() {
    return new Maybe('Nothing');
}
exports.Nothing = Nothing;
function Just(data) {
    return new Maybe('Just', data);
}
exports.Just = Just;
exports["default"] = Maybe;
