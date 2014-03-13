![MoaJs](https://raw.github.com/Pencroff/MoaJs/master/extras/moa-logo-web.png "MoaJs") MoaJs 
=====

ExtJs syntax for declaration object inheritance, mixins, static methods / properties / mixins, singleton declaration out of the box and near 2kB minified JavaScript code and 1kB gzip. You can see **current** version MoaJs in root and **release** version in `release` folder.

## Documentation ##

- **MoaJs API**
		
	- `define` - declare new object type / get constructor by type name
	- `mixin` - declare new mixin type
	- `getType()` - predefined exemplar method, which return declared type name  
	- `getRegistry()` - return object with arrays of types and mixins
	```javascript
	{
		type: ['base', 'child'],
		mixin: ['numMix', 'strMix']
	}
	```

- **Object declaration**

Declaration without `$base` closure
```javascript
	// Moa.define($name, $object)
	// $name - type name
	// $object - object with declaration fields and methods
	// $ctor - object constructor 
	var constructor = Moa.define('baseObj', {
		$ctor: function (name) {
            this.name = name;
        },
		getName: function() {
			return this.name;
		}
	});
```
Declaration inheritance and `$base` closure
```javascript
	// Moa.define($name, $function)
	// $name - type name
	// $function - function with declaration fields and methods,
	//				has $base parameter, for parrent implementation
	var constructor = Moa.define('child', function ($base) {
		// $base - containe reference to 'baseObj'
        return {
            $extend: 'baseObj',
            $ctor: function (name, age) {
                this.age = age;
                $base.$ctor.call(this, name);
            },
            getAge: function () {
                return this.age;
            }
        };
	});
```
Delete declaration
```javascript
	Moa.define('base', {}); 	// new type declaration
	Moa.define('base', null); 	// delete type declaration
```

- **`$base` closure**

Declaration
```javascript
	var childItem,
		base = Moa.define('base', function ($base) {
			// $base - undefined
			return {
				$ctor: function (name) {
		            this.name = name;
		        },
				getName: function() {
					return this.name;
				}
			};
		}),
		child = Moa.define('child', function ($base) {
			// $base - reference to 'base' type
	        return {
	            $extend: 'base',
	            $ctor: function (name, age) {
	                this.age = age;
	                $base.$ctor.call(this, name);
	            },
				// override base implementation
				getName: function() {
					return 'Child: ' + $base.getName.call(this);
				},
	            getAge: function () {
	                return this.age;
	            }
			};
        });
```
Using
```
	childItem = new child('Pet', 7);
	childItem.getName(); // 'Child: Pet'
	childItem.getAge();  // 7
```

- **Mixins**

Declaration mixins
```javascript
	var BaseConstructor, item,
		numMix = function () {
            this.add = function () {
                return (this.a + this.b);
            };
        },
        strMix = function () {
            this.add = function () {
                return (this.a.toString() + this.b.toString());
            };
        },
		base = {
            $ctor: function (a, b) {
                this.a = a;
                this.b = b;
            },
            $mixin: {
                num: 'numMix',
                str: 'strMix'
            }
        };
	Moa.mixin('numMix', numMix);
	//Moa.mixin('numMix', null); // Delete mixin declaration
    Moa.mixin('strMix', strMix);
	Moa.define('base', base);
```
Using mixins
```javascript
	BaseConstructor = Moa.define('base');
	item = new BaseConstructor(10, 12);
	item.add(); // '1012' - last 'str' mixin override 'num' mixin
	// but you already use it
	item.num.add.call(item); // 22
	item.str.add.call(item); // '1012' 
```
Delete declaration
```javascript
	Moa.mixin('mix', function () {}); 	// new mixin declaration
	Moa.mixin('mix', null); 			// delete mixin declaration
```

- **Static methods and mixin declaration**

Declaration
```javascript
var baseCtor, item,
    strMix = function () {
        this.add = function () {
            return (this.a.toString() + this.b.toString());
        };
    }
	base = {
        $ctor: function () {
        },
        $static: {
			// Also you can declare static mixins in usual way
			$mixin: {
                str: 'strMix'
            },
            getMsg: function () {
                return 'Static!';
            },
            a: 15,
			b: 17
        }
    };
Moa.mixin('strMix', strMix);
Moa.define('base', base);
```
Using
```javascript
	baseCtor = Moa.define('base');
	baseCtor.getMsg(); // 'Static!' - static method
	baseCtor.add(); // '15' + '17' => '1517' - static mixin
	Ctor.str.add.call(Ctor); // '1517'
```

- **Singleton**

Declaration
```javascript
var itemA, itemB, ItemC,
	singeltonConstructor = Moa.define('singleExample', {
	$single: true,
	$ctor: function () {
        this.name = 'Moa';
    },
    getName: function () {
        return this.name;
    }
})
```
Using
```javascript
	// Unfortunately it can not have constructor parameters
	itemA = new singeltonConstructor();
	itemB = singeltonConstructor();
	itemC = singeltonConstructor.getInstance();
	// itemA equal itemB equal itemC
```
## Items ##

### Mixins ###

- **Randomise mixin**
	- rnd from 0 to range
	- rnd in range min - max
- **Search mixin**
	- linear search (equal, less, greater)
	- binary search (equal, greater)
- **Sort mixin**
	- swap elements
	- qsort
	- comb sort
	- gnome sort
	- shaker sort
	- insert sort
	- binary insert sort
	- merge sort
	- hybrid merge sort with insert sort
	- one array merge sort
	- selection sort
- **Throw Error mixin**

	*Generate error if not right condition*

	- undefined error
	- indexOf error
	- notInRange error
	- notInstanceOf error
	- notObj error
	- notFn error
	- notStr error
	- notEqual error

## Changelog ##

MoaJs v0.1.3 - in process

- IoC implementation
- delete mixins `Moa.mixixn('mix', null)`

MoaJs v0.1.2

- `getRegistry` - list available types and mixins
- Set up release process (version, minification, compression) and save result to `release` folder

MoaJs v0.1.1

- rindomise mixin
- search mixin
- sort mixin
- throw error mixin
- [grunt-benchmark](https://www.npmjs.org/package/grunt-benchmark) for testing performance

MoaJs v0.1.0

- declare object in ExtJs syntax and get it by type name
- object inheritance with $extend by type name
- using $base closure for executin parent constructor or methods
- static methods
- simple 'singleton' declaration
- mixins
- static mixins
- support client side (AMD / direct reference)
- support CommonJs declaration

## Performance ##

[Link to jsperf.com](http://jsperf.com/moo-resig-ender-my/31)

## Sources of inspirations ##

- [JavaScript Override Patterns](http://webreflection.blogspot.ie/2010/02/javascript-override-patterns.html "JavaScript Override Patterns")
- [my.class.js](http://jiem.github.io/my-class/ "my.class.js")
- [Objs](https://github.com/tekool/objs/ "Objs")
- [A fresh look at JavaScript Mixins](http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/ "A fresh look at JavaScript Mixins")

## License ##
Copyright © 2013-2014 Sergii Danilov, [pencroff.com](http://pencroff.com "pencroff.com")

MoaJs may be freely distributed under the MIT license.

___

**Feel free to contact me should you require any futher information.**

