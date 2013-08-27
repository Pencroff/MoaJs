define("add", [], function() {
    return function(a, b) {
        return a + b;
    };
});

define("mult", [ "add" ], function(add) {
    return function(a, b) {
        var i, result = 0;
        for (i = 0; a > i; i += 1) result = add(result, b);
        return result;
    };
});

define("math", [ "add", "mult" ], function(add, mult) {
    return {
        add: add,
        mult: mult
    };
});