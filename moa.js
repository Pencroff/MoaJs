define("str", [], function() {
    return {
        _serv_: {
            TObj: "object",
            TFunc: "function",
            TStr: "string",
            TUndef: "undefined"
        },
        err: {
            notObj: "Value is not object",
            notStr: "Value is not string"
        }
    };
});

define("tool", [ "str" ], function(str) {
    return {
        is: function(obj, type) {
            return typeof obj === type;
        },
        isObj: function(obj) {
            return this.is(obj, str._serv_.TObj) && null !== obj;
        },
        isFunc: function(obj) {
            return this.is(obj, str._serv_.TFunc);
        },
        isStr: function(obj) {
            return this.is(obj, str._serv_.TStr);
        },
        isUndef: function(obj) {
            return this.is(obj, str._serv_.TUndef);
        },
        clone: function(obj, useDeep) {
            var prop, i, len, me = this, result = {};
            if (obj instanceof Date) result = new Date(obj); else if (obj instanceof Array) {
                len = obj.length;
                result = [];
                for (i = 0; len > i; i += 1) result[i] = me.clone(obj[i], useDeep);
            } else {
                if (!me.isObj(obj)) return obj;
                for (prop in obj) obj.hasOwnProperty(prop) && (result[prop] = useDeep === !0 ? me.isObj(obj[prop]) ? me.clone(obj[prop], useDeep) : obj[prop] : obj[prop]);
            }
            return result;
        },
        isEqual: function(objA, objB, useDeep) {
            var leftChain, rightChain, result = !0, compareObj = function(x, y) {
                var p;
                if (isNaN(x) && isNaN(y) && "number" == typeof x && "number" == typeof y) return !0;
                if (x === y) return !0;
                if ("function" == typeof x && "function" == typeof y || x instanceof Date && y instanceof Date || x instanceof RegExp && y instanceof RegExp || x instanceof String && y instanceof String || x instanceof Number && y instanceof Number) return x.toString() === y.toString();
                if (!(x instanceof Object && y instanceof Object)) return !1;
                if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) return !1;
                if (x.constructor !== y.constructor) return !1;
                if (x.prototype !== y.prototype) return !1;
                if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) return !1;
                for (p in y) {
                    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) return !1;
                    if (typeof y[p] != typeof x[p]) return !1;
                }
                for (p in x) {
                    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) return !1;
                    if (typeof y[p] != typeof x[p]) return !1;
                    switch (typeof x[p]) {
                      case "object":
                      case "function":
                        leftChain.push(x);
                        rightChain.push(y);
                        if (!compareObj(x[p], y[p])) return !1;
                        leftChain.pop();
                        rightChain.pop();
                        break;

                      default:
                        if (x[p] !== y[p]) return !1;
                    }
                }
                return !0;
            };
            if (useDeep === !0) {
                leftChain = [];
                rightChain = [];
                compareObj(objA, objB) || (result = !1);
            } else result = JSON.stringify(objA) === JSON.stringify(objB);
            return result;
        }
    };
});

define("obj", [ "tool", "str" ], function(tool, str) {
    var map = {}, obj = function(objName, objProp) {
        if (!tool.isStr(objName)) throw new Error(str.err.notStr);
        if (!tool.isObj(objProp) && !tool.isUndef(objProp)) throw new Error(str.err.notObj);
        tool.isObj(objProp) && (map[objName] = objProp);
        return map[objName];
    };
    return obj;
});

define("Moa", [ "obj", "tool" ], function(obj, tool) {
    var _moa = {
        Obj: obj,
        Tool: tool
    };
    return _moa;
});