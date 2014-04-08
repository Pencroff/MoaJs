/**
 * Created with WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 10/31/13
 * Time: 6:10 PM
 */
/*global define:true, module:true*/
/**
 * @module Moa
 *
 * @desc MoaJs micro library for easiest implementation of prototype inheritance,
 * closure for base prototype, mixins, static methods and mixins,
 * simple declaration for singleton behavior of type in JavaScript.
 * MoaJs contains IoC container for resolving declared types as
 * field or constructor injection to instance
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
        map = {},
        mixins = {},
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
        fastExtend = function (target, source) {
            var prop;
            for (prop in source) {
                target[prop] = source[prop];
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
        resolveDeclaration = function (type, diConfiguration, owner) {
            var configurationProperty, configurationValue, configurationValueType,
                typeObj, propFlag = false;
            diConfiguration = diConfiguration || {};
            if (!diConfiguration.$current) {
                diConfiguration.$current = type;
            }
            for (configurationProperty in diConfiguration) {
                configurationValue = diConfiguration[configurationProperty];
                configurationValueType = typeof configurationValue;
                switch (configurationProperty) {
                case '$current':
                    switch (configurationValueType) {
                    case 'string':
                        configurationValue = {
                            type: configurationValue,
                            instance: 'item',
                            lifestyle: 'transient'
                        };
                        break;
                    case 'object':
                        configurationValue.type = type;
                        if (!configurationValue.instance) {
                            configurationValue.instance = 'item';
                        }
                        if (!configurationValue.lifestyle && configurationValue.instance !== 'ctor') {
                            configurationValue.lifestyle = 'transient';
                        }
                        break;
                    default:
                    }
                    break;
                case '$ctor':
                    configurationValue = resolveDeclaration(type, configurationValue, configurationProperty);
                    delete configurationValue.$current;
                    break;
                case '$proto':
                    configurationValue = resolveDeclaration(type, configurationValue, configurationProperty);
                    delete configurationValue.$current;
                    break;
                case '$prop':
                    configurationValue = resolveDeclaration(type, configurationValue, configurationProperty);
                    delete configurationValue.$current;
                    break;
                default:
                    propFlag = true;
                    switch (configurationValueType) {
                    case 'string':
                        typeObj = map[configurationValue];
                        if (typeObj) {
                            if (owner === '$proto') {
                                configurationValue = fastExtend({}, typeObj.$di.$current);
                                configurationValue.lifestyle = 'singleton';
                            } else {
                                configurationValue = typeObj.$di.$current;
                            }
                        }
                        break;
                    case 'object':
                        if (configurationValue.type) {
                            if (configurationValue.instance === 'ctor') {
                                delete configurationValue.lifestyle;
                            } else {
                                if (!configurationValue.instance) {
                                    configurationValue.instance = 'item';
                                }
                                if (!configurationValue.lifestyle) {
                                    configurationValue.lifestyle = 'transient';
                                }
                            }
                        }
                        break;
                    default:
                    }
                }
                if (owner || !propFlag) {
                    diConfiguration[configurationProperty] = configurationValue;
                } else {
                    propFlag = false;
                    if (!diConfiguration.$prop) {
                        diConfiguration.$prop = {};
                    }
                    diConfiguration.$prop[configurationProperty] = configurationValue;
                    delete diConfiguration[configurationProperty];
                }
            }
            return diConfiguration;
        },
        Moa = {
            /**
             * Clear all defined types and mixins
             * @method clear
             */
            clear: function () {
                var clearObj = function (obj) {
                    var prop;
                    for (prop in obj) {
                        delete obj[prop];
                    }
                };
                clearObj(map);
                clearObj(mixins);
            },
            /**
             * Declaration configuration for type
             * @typedef {object} DeclarationConf
             * @property {function} [$ctor] - constructor of type
             * @property {string} [$extend] - inheritable type name
             * @property {DiConf} [$di] - configuration for IoC container
             * @property {object} [$mixin] - literal with mixins declaration
             * @property {object} [$static] - literal with properties and function that applied to constructor
             * @property {boolean} [$single] - setup type as singleton
             */
            /**
             * Declaration configuration for type
             * @typedef {function} DeclarationFn
             * @param {object} $base - prototype of inheritable type with $base.$ctor - constructor of inheritable type
             * @return {DeclarationConf} object that uses $base closure for access to inheritable type implementation constructor and methods
             */
            /**
             * Define new or inherited type
             * @method define
             * @param {string} type - name of type
             * @param {(DeclarationConf|DeclarationFn)} [definition] - see {@link DeclarationConf} or {@link DeclarationFn}.
             * If it is null - delete declared object
             * @return {function} constructor of defined object type
             *
             * @example <caption>Declaration without <code>$base</code> closure</caption>
             * var constructor = Moa.define('baseObj', {
             *      $ctor: function (name) {
             *              this.name = name;
             *          },
             *      getName: function() {
             *          return this.name;
             *      }
             *  });
             *
             * @example <caption>Declaration inheritance and <code>$base</code> closure</caption>
             * var constructor = Moa.define('child', function ($base) {
             *     // $base - containe reference to prototype of 'baseObj'
             *     return {
             *         $extend: 'baseObj',
             *         $ctor: function (name, age) {
             *             this.age = age;
             *             $base.$ctor.call(this, name);
             *         },
             *         getAge: function () {
             *             return this.age;
             *         }
             *     };
             * });
             *
             * @example <caption>Delete type declaration</caption>
             * Moa.define('base', {});     // new type declaration
             * Moa.define('base', null);   // delete type declaration
             *
             * @example <caption>Declaration <code>$base</code> closure</caption>
             * var childItem,
             *     base = Moa.define('base', function ($base) {
             *        // $base - undefined
             *        return {
             *            $ctor: function (name) {
             *                this.name = name;
             *            },
             *            getName: function() {
             *                return this.name;
             *            }
             *        };
             *     }),
             *     child = Moa.define('child', function ($base) {
             *        // $base - reference to 'base' type
             *        return {
             *            $extend: 'base',
             *            $ctor: function (name, age) {
             *                this.age = age;
             *                $base.$ctor.call(this, name);
             *            },
             *            // override base implementation
             *            getName: function() {
             *                return 'Child: ' + $base.getName.call(this);
             *            },
             *            getAge: function () {
             *                return this.age;
             *            }
             *        };
             *    });
             *
             * @example <caption>Using instance</caption>
             * childItem = new child('Pet', 7);
             * childItem.getName(); // 'Child: Pet'
             * childItem.getAge();  // 7
             *
             * @example <caption>Declaration static methods</caption>
             * var baseCtor, item,
             *     strMix = function () {
             *         this.add = function () {
             *             return (this.a.toString() + this.b.toString());
             *         };
             *     }
             *     base = {
             *         $ctor: function () {
             *         },
             *         $static: {
             *             // Also you can declare static mixins in usual way
             *             $mixin: {
             *                 str: 'strMix'
             *             },
             *             getMsg: function () {
             *                 return 'Static!';
             *             },
             *             a: 15,
             *             b: 17
             *         }
             *     };
             * Moa.mixin('strMix', strMix);
             * Moa.define('base', base);
             *
             * @example <caption>Using static methods</caption>
             * baseCtor = Moa.define('base');
             * baseCtor.getMsg(); // 'Static!' - static method
             * baseCtor.add(); // '15' + '17' => '1517' - static mixin
             * Ctor.str.add.call(Ctor); // '1517'
             *
             * @example <caption>Declaration singleton</caption>
             * var itemA, itemB, ItemC,
             *     singeltonConstructor = Moa.define('singleExample', {
             *         $single: true,
             *         $ctor: function () {
             *             this.name = 'Moa';
             *         },
             *         getName: function () {
             *             return this.name;
             *         }
             *     })
             *
             * @example <caption>Using singleton</caption>
             * // Unfortunately it can not have constructor parameters
             * itemA = new singeltonConstructor();
             * itemB = singeltonConstructor();
             * itemC = singeltonConstructor.getInstance();
             * // itemA equal itemB equal itemC
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
                    case 'function':
                        baseType = definition().$extend;
                        if (baseType !== undef) {
                            base = map[baseType];
                            throwWrongType(base, baseType);
                            mapObj = build(type, base, definition(base.$base));
                        } else {
                            mapObj = build(type, undef, definition(undef));
                        }
                        break;
                    case 'object':
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
                    map[type].$di = resolveDeclaration(type, mapObj.$di);
                    break;
                default:
                    throwWrongParamsErr('define');
                }
                return mapObj.$ctor;
            },
            /**
             * Declaration of dependency injection behavior
             * @typedef {object} InjectionConf
             * @property {string} type - name of type for injection.
             * Not available for $current in {@link DiConf}
             * @property {string} instance - Injected instance.
             * Values: 'item' or 'ctor'. Default value: 'item'.
             * @property {string} lifestyle - Life style for 'item' instance. Not used for 'ctor'.
             * Values: 'transient' or 'singleton'. Default value: 'transient'.
             */
            /**
             * Configuration of dependency injection. Used as $di parameter in type declaration.
             * @typedef {object} DiConf
             * @property {object} [$current] - set default injection behavior for declared type
             * @property {object} [$ctor] - literal declare types that inject to constructor
             * @property {object} [$prop] - literal declare types that inject to instance properties
             * @property {object} [$proto] - literal declare types that inject to prototype of instance properties.
             * BE CAREFUL! It resolved one time after use 'resolve' method and override exist properties and methods in prototype.
             * Resolved properties and methods available in prototype of constructor type for all places where constructor uses ('define' method for example).
             * @property {*} - properties that injected as instance properties. All string values try to resolve as declared types
             * @example
             * {
             *     $ctor: {
             *         fieldA: {
             *             type: 'typeA',
             *             instance: 'item',
             *             lifestyle: 'transient'
             *         },
             *         field: 'typeB'   // try to resolve as 'typeB' otherwise use as a string
             *     },
             *     $prop: {
             *         propA: 'typeA'   // resolved like fieldA to instance field
             *     },
             *     $proto: {
             *         protoProp: {     // resolve constructor of 'typeB' to instance prototype
             *             type: 'typeB',
             *             instance: 'ctor' // if instance is 'item' it has lifestyle as 'singleton'
             *         }
             *     },
             *     propC: {             // resolve the same instance of 'typeC' for every instance in $prop literal
             *         type: 'typeA',
             *         instance: 'item',
             *         lifestyle: 'singleton'
             *     },
             *     prop: 2315           // copy number field to resolved instance
             * }
             */
            /**
             * Resolve new instance of type with field and constructor injection.
             * Resolving logic based on $di configuration of type declaration.
             * @method resolve
             * @param {string} type - name of type
             * @param {object} [paramsObj] - constructor parameter for resolved type
             * @return {object} instance of type
             */
            resolve: function (type, paramsObj) {
                var item,
                    //depthRecursion = 64, cntRecursion = 0,
                    mapObj = map[type],
                    len = arguments.length,
                    fnResolveListConf = function (target, config, fnResolveObjConf) {
                        var prop, propValue;
                        for (prop in config) {
                            propValue = config[prop];
                            if (typeof propValue === 'object') {
                                target[prop] = fnResolveObjConf(propValue, fnResolveListConf);
                            } else {
                                target[prop] = propValue;
                            }
                        }
                        return target;
                    },
                    createItem = function (declaration, obj, fnResolveObjConf, cParams) {
                        var item, conf, proto;
                        cParams = cParams || {};
                        conf = declaration.$ctor;
                        if (conf) {
                            cParams = fnResolveListConf(cParams, conf, fnResolveObjConf);
                        }
                        conf = declaration.$proto;
                        if (conf) {
                            if (!conf.resolved) {
                                proto = fnResolveListConf({}, conf, fnResolveObjConf);
                                fastExtend(obj.$ctor.prototype, proto);
                                conf.resolved = true;
                            }
                        }
                        item = new obj.$ctor(cParams);
                        conf = declaration.$prop;
                        if (conf) {
                            item = fnResolveListConf(item, conf, fnResolveObjConf);
                        }
                        return item;
                    },
                    fnResolveObjConf = function (declaration, ctorParams) {
                        var resolvedObj,
                            current = declaration.$current;
                        /*==========================================================
                        if you have problem with IoC, just uncomment 3 rows bellow
                        and second row in 'resolve' function
                        =========================================================*/
//                        cntRecursion += 1;
//                        if (cntRecursion > depthRecursion) {
//                            throw new Error('Loop of recursion', 'moa');
//                        }
                        if (current) {
                            resolvedObj = map[current.type];
                        } else {
                            current = declaration;
                            resolvedObj = map[current.type];
                            if (resolvedObj) {
                                declaration = resolvedObj.$di;
                            } else {
                                return declaration;
                            }
                        }
                        switch (current.instance) {
                        case 'item':
                            switch (current.lifestyle) {
                            case 'transient':
                                item = createItem(declaration, resolvedObj, fnResolveObjConf, ctorParams);
                                break;
                            case 'singleton':
                                if (!current.item) {
                                    current.item = createItem(declaration, resolvedObj, fnResolveObjConf, ctorParams);
                                }
                                item = current.item;
                                break;
                            default:
                                throwWrongParamsErr('resolve', type + '::$di::$current::lifestyle');
                            }
                            break;
                        case 'ctor':
                            item = resolvedObj.$ctor;
                            break;
                        default:
                            throwWrongParamsErr('resolve', type + '::$di::$current::instance');
                        }
                        return item;
                    };
                if (len !== 1 && len !== 2) {
                    throwWrongParamsErr('resolve');
                }
                throwWrongType(mapObj, type);
                item = fnResolveObjConf(mapObj.$di, paramsObj);
                return item;
            },
            /**
             * Declare mixin
             * @method mixin
             * @param {string} mixType - name of mixin type
             * @param {function} definition - implementation of behavior for mixin.
             * If it is null - delete declared mixin
             *
             * @example <caption>Declaration mixin</caption>
             * var numMix = function () {
             *      this.add = function () {
             *          return (this.a + this.b);
             *      };
             *      this.sub = function () {
             *         return (this.a - this.b);
             *      };
             *      this.mul = function () {
             *          return (this.a * this.b);
             *      };
             * };
             * Moa.mixin('numMix', numMix);
             *
             * @example <caption>Using mixin</caption>
             * var item, Ctor,
             *     base = {
             *     $ctor: function (a, b) {
             *         this.a = a;
             *         this.b = b;
             *     },
             *     $mixin: {
             *         nummix: 'numMix'
             *     },
             *     mul: function () {
             *         return 'a*b=' + this.nummix.mul.call(this);
             *     }
             * };
             * Ctor = Moa.define('base', base);
             * item = new Ctor(3, 4);
             * item.add(); // 7
             * item.mul(); // 'a*b=12'
             *
             * @example <caption>Multiple mixins example</caption>
             * var Ctor, item,
             *     base = {
             *         $ctor: function (a, b) {
             *             this.a = a;
             *             this.b = b;
             *         },
             *         $mixin: {
             *             num: 'numMix',
             *             str: 'strMix'
             *         }
             *     },
             *     numMix = function () {
             *         this.add = function () {
             *             return (this.a + this.b);
             *         };
             *     },
             *     strMix = function () {
             *         this.add = function () {
             *             return (this.a.toString() + this.b.toString());
             *         };
             *     };
             * Moa.mixin('numMix', numMix);
             * Moa.mixin('strMix', strMix);
             * Ctor = Moa.define('base', base);
             * item = new Ctor(10, 12);
             * item.add(); // '1012'
             * item.num.add.call(item); // 22
             * item.str.add.call(item); //'1012'
             *
             * @example <caption>Delete mixin declaration</caption>
             * Moa.mixin('mix', function () {});    // new mixin declaration
             * Moa.mixin('mix', null);    // delete mixin declaration
             *
             * @example <caption>Static mixin declaration</caption>
             * var base = {
             *     $mixin: {
             *         num: 'numMix'
             *     },
             *     $static: {
             *         $mixin: {
             *             str: 'strMix'
             *         }
             *     }
             * }
             */
            mixin: function (mixType, definition) {
                if (definition !== null) {
                    if (typeof definition !== 'function') {
                        throwWrongParamsErr('mixin', 'definition');
                    }
                    mixins[mixType] = definition;
                } else {
                    delete mixins[mixType];
                }
            },
            /**
             * Get all available types and mixins
             * @method getRegistry
             * @return {object} object with arrays declared types and mixins
             * @example
             * {
             *   type: ['type1', 'type2', ...],
             *   mixin: ['mixin1', 'mixin2', ...]
             * }
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
            /**
             * Get internal information about type
             * @method getTypeInfo
             * @param {string} type - name of type
             * @return {object} object with information about type,
             * base type, applied mixins and configuration for dependency injection
             * @example
             * {
             *      $type: 'child',
             *      $basetype: 'base',
             *      $mixin: {
             *          mixA: 'mixinA',
             *          mixB: 'mixinB'
             *      },
             *      $di: {
             *          $current: {
             *              type: 'child',
             *              instance: 'item',
             *              lifestyle: 'transient'
             *          },
             *          $prop: {
             *              a: {
             *                  type: 'base',
             *                  instance: 'item',
             *                  lifestyle: 'transient'
             *              },
             *              b: 'child'
             *          }
             *      }
             *  }
             */
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
    if (typeof define !== 'undefined') {
        define([], function () { return Moa; });
    } else if (typeof window !== 'undefined') {
        window.Moa = Moa;
    } else {
        module.exports = Moa;
    }
}());