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
//                case '$proto':
//                    configurationValue = resolveDeclaration(type, configurationValue, configurationProperty);
//                    delete configurationValue.$current;
//                    break;
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
                            configurationValue = typeObj.$di.$current;
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
             * Define new or inherited type
             * @method define
             * @param {string} type - name of type
             * @param {(object|function)} definition - implementation of behavior for current type of object.
             * If it is null - delete declared object
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
             * Resolve new instance of type with field and constructor injection
             * @method resolve
             */
            resolve: function (type, configObj) {
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
                        var item, conf;
                        cParams = cParams || {};
                        conf = declaration.$ctor;
                        if (conf) {
                            cParams = fnResolveListConf(cParams, conf, fnResolveObjConf);
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
                item = fnResolveObjConf(mapObj.$di, configObj);
                return item;
            },
            /**
             * Declare new mixin
             * @method mixin
             * @param {string} mixType - name of mixin type
             * @param {function} definition - implementation of behavior for mixin.
             * If it is null - delete declared mixin
             *
             * @throws Wrong parameter definition in mixin
             * @throws Mixin type SOMEMIXIN not found
             *
             * @example <caption>Declaration</caption>
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
             *  };
             *  Moa.mixin('numMix', numMix);
             *  @example <caption>Using</caption>
             *  var item, Ctor,
             *      base = {
             *      $ctor: function (a, b) {
             *          this.a = a;
             *          this.b = b;
             *      },
             *      $mixin: {
             *          nummix: 'numMix'
             *      },
             *      mul: function () {
             *          return 'a*b=' + this.nummix.mul.call(this);
             *      }
             *  };
             *  Ctor = Moa.define('base', base);
             *  item = new Ctor(3, 4);
             *  item.add(); // 7
             *  item.mul(); // 'a*b=12'
             *  @example <caption>Multiple mixins example</caption>
             *  var Ctor, item,
             *      base = {
             *          $ctor: function (a, b) {
             *              this.a = a;
             *              this.b = b;
             *          },
             *          $mixin: {
             *              num: 'numMix',
             *              str: 'strMix'
             *          }
             *      },
             *      numMix = function () {
             *          this.add = function () {
             *              return (this.a + this.b);
             *          };
             *      },
             *      strMix = function () {
             *          this.add = function () {
             *              return (this.a.toString() + this.b.toString());
             *          };
             *      };
             *  Moa.mixin('numMix', numMix);
             *  Moa.mixin('strMix', strMix);
             *  Ctor = Moa.define('base', base);
             *  item = new Ctor(10, 12);
             *  item.add(); // '1012'
             *  item.num.add.call(item); // 22
             *  item.str.add.call(item); //'1012'
             *  @example <caption>Static mixin declaration</caption>
             *  var base = {
             *      $mixin: {
             *          num: 'numMix'
             *      },
             *      $static: {
             *          $mixin: {
             *              str: 'strMix'
             *          }
             *      }
             *  }
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