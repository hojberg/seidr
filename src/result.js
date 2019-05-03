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
var maybe_1 = require("./maybe");
// some cool result
var Result = /** @class */ (function (_super) {
    __extends(Result, _super);
    function Result() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Result.prototype.map = function (f) {
        return this.caseOf({
            Err: function (err) { return Err(err); },
            Ok: function (data) { return Ok(f(data)); }
        });
    };
    Result.prototype.flatMap = function (f) {
        return this.caseOf({
            Err: function (err) { return Err(err); },
            Ok: function (data) { return f(data); }
        });
    };
    Result.prototype.toMaybe = function () {
        return this.caseOf({
            Err: function (_) { return maybe_1.Nothing(); },
            Ok: maybe_1.Just
        });
    };
    return Result;
}(sums_up_1["default"]));
exports.Result = Result;
function Err(error) {
    return new Result('Err', error);
}
exports.Err = Err;
function Ok(data) {
    return new Result('Ok', data);
}
exports.Ok = Ok;
exports["default"] = Result;
