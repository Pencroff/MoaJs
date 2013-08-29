define("str", [], function() {
    return {
        _intrnl_: {
            prefix: "__moa__",
            TObject: "object",
            TString: "string"
        },
        err: {
            notString: "Object Name is not string!"
        }
    };
});

define("tool", [ "str" ], function(str) {
    return {
        is: function(obj, type) {
            return typeof obj === type;
        },
        isObject: function(obj) {
            return this.is(obj, str._intrnl_.TObject) && null !== obj;
        },
        isString: function(obj) {
            return this.is(obj, str._intrnl_.TString);
        }
    };
});

define("obj", [ "tool", "str" ], function(tool, str) {
    var obj = function(objName) {
        if (!tool.isString(objName)) throw new Error(str.err.notString);
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