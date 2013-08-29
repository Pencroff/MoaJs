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