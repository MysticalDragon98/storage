"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONStorage = void 0;
var proxies_1 = require("@mysticaldragon/proxies");
var JSONStorage = /** @class */ (function () {
    function JSONStorage(storage, path) {
        this.storage = storage;
        this.path = path;
        this._initialized = false;
        this._isSaving = false;
        this._isQueued = false;
    }
    Object.defineProperty(JSONStorage.prototype, "proxy", {
        get: function () {
            var _this = this;
            return proxies_1.ElasticProxy.newRecursive({
                recursive: true,
                apply: function (path, args) {
                    if (args.length === 1) {
                        return _this.set(path, args[0]);
                    }
                    else {
                        return _this.get(path);
                    }
                }
            });
        },
        enumerable: false,
        configurable: true
    });
    JSONStorage.prototype.init = function () {
        if (this._initialized)
            return;
        this._cache = this.storage.readSync(this.path, {});
        this._initialized = true;
    };
    JSONStorage.prototype.get = function (props) {
        this.init();
        var ptr = this._cache;
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var prop = props_1[_i];
            ptr = ptr[prop];
            if (ptr === undefined)
                return undefined;
        }
        return ptr;
    };
    JSONStorage.prototype.set = function (props, val) {
        this.init();
        var ptr = this._cache;
        for (var i = 0; i < props.length - 1; i++) {
            var temp_ptr = ptr;
            ptr = ptr[props[i]];
            if (ptr === undefined)
                ptr = temp_ptr[props[i]] = {};
        }
        ptr[props[props.length - 1]] = val;
        this.save();
    };
    JSONStorage.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._isSaving) {
                            this._isQueued = true;
                            return [2 /*return*/];
                        }
                        this._isSaving = true;
                        return [4 /*yield*/, this.storage.write(this.path, this._cache)];
                    case 1:
                        _a.sent();
                        this._isSaving = false;
                        if (this._isQueued) {
                            this._isQueued = false;
                            this.save();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return JSONStorage;
}());
exports.JSONStorage = JSONStorage;
//# sourceMappingURL=json-storage.js.map