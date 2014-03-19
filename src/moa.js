/**
 * Created with WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 10/31/13
 * Time: 6:10 PM
 */
/*global define:true, module:true*/
/**
 Prototype inheritance and extensions in JavaScript
 @module Moa
 */
(function () {
    "use strict";
    if (!Object.create) {
        Object.create = (function () {
            function F() {}
            return function (o) {
                if (arguments.length !== 1) {
                    throw new Error('Object.create implementation only accepts one parameter.');
                }
                F.prototype = o;
                return new F();
            };
        }());
    }
    var undef,
        fn = 'function',
        ob = 'object',
        un = 'undefined',
        str = 'string',
        map = {},
        mixins = {},
        di = {},
        extend = function (target, source) {
            var prop;
            if (source) {
                for (prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
                //Some Object methods are not enumerable on Internet Explorer
                target.toString = source.toString;
                target.valueOf = source.valueOf;
                target.toLocaleString = source.toLocaleString;
            }
            return target;
        },
        throwWrongParamsErr = function (method, param) {
            var msg = 'Wrong parameters in ' + method;
            if (param) {
                msg = 'Wrong parameter ' + param + ' in ' + method;
            }
            throw new Error(msg, 'Moa');
        },
        throwWrongType = function (obj, extendType, isMixin) {
            var type = 'Type ';
            if (obj === undef) {
                if (isMixin === true) {
                    type = 'Mixin type ';
                }
                throw new Error(type + extendType + ' not found', 'Moa');
            }
        },
        addMixins = function ($proto, $mixin) {
            var prop,
                value,
                MixFn;
            for (prop in $mixin) {
                value = $mixin[prop];
                MixFn = mixins[value];
                throwWrongType(MixFn, value, true);
                MixFn.call($proto);
                $proto[prop] = new MixFn();
            }
            return $proto;
        },
        resolveDeclaration = function (type, diConf) {
            var prop, confValue;
            diConf = diConf || {};
            if (!diConf.$current) {
                diConf.$current = type;
            }
            for (prop in diConf) {
                if (prop === '$ctor') {
                    diConf[prop] = resolveDeclaration(type, diConf[prop]);
                } else {
                    confValue = diConf[prop];
                    switch (typeof confValue) {
                    case str:
                        if (map[confValue]) {
                            diConf[prop] = {
                                type: confValue,
                                instance: 'item',
                                lifestyle: 'transient'
                            };
                        }
                        break;
                    case ob:
                        confValue.type = type;
                        if (confValue.instance === 'ctor') {
                            delete confValue.lifestyle;
                        } else {
                            confValue.instance = 'item';
                            if (confValue.lifestyle && confValue.lifestyle !== 'singleton') {
                                confValue.lifestyle = 'transient';
                            }
                        }
                        break;
                    default:
                    }
                }
            }
            return diConf;
        },
        build = function (type, base, definition) {
            var basetype,
                $staticMixin,
                $single = definition.$single,
                $static = definition.$static,
                $mixin = definition.$mixin,
                $ctor = definition.$ctor,
                $di = definition.$di,
                $base = {};
            if ($ctor !== undef) {
                delete definition.$ctor;
            } else {
                $ctor = function () {};
            }
            delete definition.$single;
            delete definition.$static;
            delete definition.$mixin;
            delete definition.$extend;
            if ($static !== undef) {
                $staticMixin = $static.$mixin;
                if ($staticMixin !== undef) {
                    delete $static.$mixin;
                    addMixins($ctor, $staticMixin);
                }
                extend($ctor, $static);
            }
            if ($mixin !== undef) {
                definition = extend(addMixins({}, $mixin), definition);
            }
            if (base !== undef) {
                basetype = base.$type;
                definition = extend(Object.create(base.$ctor.prototype), definition);
            }
            definition.getType = function () {
                return type;
            };
            extend($base, definition);
            $ctor.prototype = definition;
            $ctor.prototype.constructor = $ctor;
            if ($single !== undef && $single === true) {
                (function () {
                    var instance = new $ctor();
                    $ctor = function () {
                        return instance;
                    };
                    $ctor.getInstance = function () {
                        return instance;
                    };
                }());
            }
            $base.$ctor = $ctor;
            return {
                $type: type,
                $basetype: basetype,
                $mixin: $mixin,
                $di: $di,
                $ctor: $ctor,
                $base: $base
            };
        },
        /**
         @class Moa
        */
        Moa = {
            /**
             * Define new or inherited type
             * @method define
             * @param type {string} name of object type
             * @param definition {Object / Function} implementation of behavior for current type of object. If it is null - delete declared object
             * @return {function} constructor of defined object type
             */
            define: function (type, definition) {
                var mapObj, baseType, base,
                    len = arguments.length;
                switch (len) {
                case 1:
                    mapObj = map[type];
                    throwWrongType(mapObj, type);
                    break;
                case 2:
                    switch (typeof definition) {
                    case fn:
                        baseType = definition().$extend;
                        if (baseType !== undef) {
                            base = map[baseType];
                            throwWrongType(base, baseType);
                            mapObj = build(type, base, definition(base.$base));
                        } else {
                            mapObj = build(type, undef, definition(undef));
                        }
                        break;
                    case ob:
                        if (definition !== null) {
                            baseType = definition.$extend;
                            if (baseType !== undef) {
                                base = map[baseType];
                                throwWrongType(base, baseType);
                            }
                            mapObj = build(type, base, definition);
                        } else {
                            delete map[type];
                            return undef;
                        }
                        break;
                    default:
                        throwWrongParamsErr('define', 'definition');
                    }
                    map[type] = mapObj;
                    map[type].$di = resolveDeclaration(type, map[type].$di);
                    break;
                default:
                    throwWrongParamsErr('define');
                }
                return mapObj.$ctor;
            },
            /**
             * Declare new mixin type
             * @method mixin
             * @param mixType {string} name of mixin type
             * @param definition {Function} implementation of behavior for mixin.
             */
            mixin: function (mixType, definition) {
                if (definition !== null) {
                    if (typeof definition !== fn) {
                        throwWrongParamsErr('mixin', 'definition');
                    }
                    mixins[mixType] = definition;
                } else {
                    delete mixins[mixType];
                }
            },
            resolve: function (type, configObj) {
                var item, cnt = 0,
                    mapObj = map[type],
                    len = arguments.length,
                    createItem = function (cParams, cObj, mObj) {
                        var item;
                        if (cParams) {
                            cParams = extend(cParams, cObj);
                            item = new mObj.$ctor(cParams);
                        } else {
                            item = new mObj.$ctor(cObj);
                        }
                        return item;
                    },
                    resolveObjConf = function (declaration, fnResolveListConf, mp, ctorParams) {
                        var ctorObj, propObj, mpObj,
                            current = declaration.$current,
                            ctor = declaration.$ctor;
                        cnt += 1;
                        if (cnt > 25) {
                            throw new Error('Loop of recursion', 'moa');
                        }
                        console.log('Declaration:');
                        console.log(declaration);
                        mpObj = mp[current.type];
                        switch (current.instance) {
                        case 'item':
                            if (ctor) {
                                ctorObj = fnResolveListConf(ctor, resolveObjConf, mp);
                            }
                            propObj = fnResolveListConf(declaration, resolveObjConf, mp);
                            switch (current.lifestyle) {
                            case 'transient':
                                item = createItem(ctorParams, ctorObj, mpObj);
                                break;
                            case 'singleton':
                                if (!current.item) {
                                    current.item = createItem(ctorParams, ctorObj, mpObj);
                                }
                                item = current.item;
                                break;
                            default:
                                throwWrongParamsErr('resolve', type + '::$di::$current::lifestyle');
                            }
                            break;
                        case 'ctor':
                            item = mpObj.$ctor;
                            break;
                        default:
                            throwWrongParamsErr('resolve', type + '::$di::$current::instance');
                        }
                        if (propObj) {
                            item = extend(item, propObj);
                        }
                        return item;
                    },
                    resolveListConf = function (objDeclaration, fnResolveObjConf, mp) {
                        var prop, objDetail, mpObj,
                            result = {};
                        for (prop in objDeclaration) {
                            console.log('Declaration:');
                            console.log(prop);
                            if (prop !== '$current' && prop !== '$ctor') {
                                objDetail = objDeclaration[prop];
                                mpObj = mp[objDetail.type];
                                if (mpObj) {
                                    result[prop] = fnResolveObjConf(mpObj.$di, resolveListConf, mp);
                                } else {
                                    result[prop] = objDeclaration[prop];
                                }
                            }
                        }
                        return result;
                    };
                if (len !== 1 && len !== 2) {
                    throwWrongParamsErr('resolve');
                }
                if (mapObj) {
                    item = resolveObjConf(mapObj.$di, resolveListConf, map, configObj);
                } else {
                    item = type;
                }
//                var prop, result, mapObj,
//                    Ctor, confCtor, confProp,
//                    objCtor, objProp, diConf,
//                    len = arguments.length,
//                    resolveObject = function (conf) {
//                        var prop, value,
//                            result = {};
//                        if (conf) {
//                            for (prop in conf) {
//                                value = conf[prop];
//                                switch (value.instance) {
//                                    case 'item':
//                                        if (conf.lifestyle === 'singleton') {
//                                            if (!value.item) {
//                                                value.item = Moa.resolve(conf.type);
//                                            }
//                                            result[prop] = value.item;
//                                        } else {
//                                            result[prop] = Moa.resolve(conf.type);
//                                        }
//                                        break;
//                                    case 'ctor':
//                                        result[prop] = value.ctor;
//                                        break;
//                                    default:
//                                }
//                            }
//                        }
//                        return result;
//                    };
//                if (len !== 1 && len !== 2) {
//                    throwWrongParamsErr('resolve');
//                } else {
//                    if (len === 1) {
//                        ctorConf = {};
//                    }
//                }
//                mapObj = map[type];
//                throwWrongType(mapObj, type);
//                diConf = mapObj.$di;
//                if (diConf) {
//                    if (di[type]) {
//                        confCtor = di[type].ctor;
//                        confProp = di[type].prop;
//                    } else {
//                        confCtor = resolveDeclaration(diConf.$ctor);
//                        confProp = resolveDeclaration(diConf);
//                        di[type] = {
//                            ctor: confCtor,
//                            prop: confProp
//                        };
//                    }
//                    objCtor = resolveObject(confCtor);
//                    objProp = resolveObject(confProp);
//                    if (diConf.$ctor) {
//                        ctorConf = extend(ctorConf, objCtor);
//                    }
//                }
//                Ctor = Moa.define(type);
//                result = new Ctor(ctorConf);
//                for (prop in objProp) {
//                    result[prop] = objProp[prop];
//                }
                return item;
            },
            clear: function () {
                var clearObj = function (obj) {
                    var prop;
                    for (prop in obj) {
                        delete obj[prop];
                    }
                };
                clearObj(map);
                clearObj(mixins);
                clearObj(di);
            },
            /**
             * Return object with lists of types and mixins
             * @method getRegistry
             */
            getRegistry: function () {
                var iterate = function (obj) {
                        var prop, arr = [];
                        for (prop in obj) {
                            arr.push(prop);
                        }
                        return arr;
                    };
                return {
                    type: iterate(map),
                    mixin: iterate(mixins)
                };
            },
            getTypeInfo: function (type) {
                var result,
                    mapObj = map[type];
                throwWrongType(mapObj, type);
                result = extend({}, mapObj);
                delete result.$ctor;
                delete result.$base;
                delete result.$di;
                result.$di = JSON.parse(JSON.stringify(mapObj.$di));
                return result;
            }
        };
    // Return as AMD module or attach to head object
    if (typeof define !== un) {
        define([], function () { return Moa; });
    } else if (typeof window !== un) {
        window.Moa = Moa;
    } else {
        module.exports = Moa;
    }
}());