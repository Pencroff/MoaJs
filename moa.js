define("tool", [], function() {
    var typeObject = "object", typeString = "string", typeNumber = "number";
    return {
        is: function(obj, type) {
            return typeof obj === type;
        },
        isObject: function(obj) {
            return this.is(obj, typeObject) && null !== obj;
        },
        isString: function(obj) {
            return this.is(obj, typeString);
        },
        isNumber: function(obj) {
            return this.is(obj, typeNumber);
        }
    };
});

define("obj", [ "tool" ], function(tool) {
    var obj = function(objName) {
        if (!tool.isString(objName)) throw new Error("Object Name is not string!");
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