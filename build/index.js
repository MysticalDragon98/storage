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
exports.Storage = void 0;
var fs = require("fs/promises");
var _a = require('fs'), createWriteStream = _a.createWriteStream, readFileSync = _a.readFileSync, writeFileSync = _a.writeFileSync;
var json_storage_1 = require("./json-storage");
var proxies_1 = require("@mysticaldragon/proxies");
var path_1 = require("path");
var path_2 = require("path");
var Storage = /** @class */ (function () {
    function Storage(options) {
        this.options = options;
        this._streams = {};
    }
    Storage.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mkdir(this.options.dir)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.mkdir((0, path_2.join)(this.options.dir, "json"))];
                    case 2:
                        _a.sent();
                        this.json = proxies_1.ElasticProxy.new({
                            recursive: false,
                            get: function (path) {
                                return new json_storage_1.JSONStorage(_this, _this.path("json/" + path + ".json")).proxy;
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Storage.prototype.path = function (path) {
        return (0, path_1.resolve)(this.options.dir, path);
    };
    Storage.prototype.write = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.writeFile(this.path(name), JSON.stringify(data))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Storage.prototype.writeSync = function (name, data) {
        writeFileSync(this.path(name), JSON.stringify(data));
    };
    Storage.prototype.read = function (name, defaultValue) {
        return __awaiter(this, void 0, void 0, function () {
            var exc_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 5]);
                        return [4 /*yield*/, fs.readFile(this.path(name))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        exc_1 = _a.sent();
                        if (!(exc_1.code === "ENOENT" && defaultValue)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.write(name, defaultValue)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, defaultValue];
                    case 4: throw exc_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Storage.prototype.readSync = function (name, defaultValue) {
        try {
            return readFileSync(this.path(name));
        }
        catch (exc) {
            if (exc.code === "ENOENT" && defaultValue) {
                this.writeSync(name, defaultValue);
                return defaultValue;
            }
            throw exc;
        }
    };
    Storage.prototype.mkdir = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var exc_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs.mkdir(this.path(path))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        exc_2 = _a.sent();
                        if (exc_2.code !== 'EEXIST')
                            throw exc_2;
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Storage.prototype.stream = function (path) {
        var file = this._streams[path];
        if (file)
            return file;
        return this._streams[path] = createWriteStream(this.path(path), {
            flags: 'a+'
        });
    };
    return Storage;
}());
exports.Storage = Storage;
//# sourceMappingURL=index.js.map