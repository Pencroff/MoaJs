![MoaJs](https://raw.github.com/Pencroff/MoaJs/master/extras/moa-logo-web.png "MoaJs") MoaJs 
=====

ExtJs sintaxis for implementation object inheritance, static methods / properties, mixins and less then 2kB minified JavaScript code (again bicycle) :) 

### Documentation ###

- **MoaJs API**
		
	- `define` - declare new object type / get constructor by type name
	- `mixin` - declare new mixin type
	- `getType()` - predefined exemplar method, which return declared type name  


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
				}
	            getAge: function () {
	                return this.age;
	            }
			};
        };
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

- **Static methods declaration**



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

### Changelog ###

MoaJs v0.1

- define object constructor and get it by type name
- object inheritance with $extend by type name
- using $base closure for executin parent constructor or methods
- static methods
- simple 'singleton' declaration
- mixins implementation
- static mixins
- support client side (AMD / direct reference)
- support CommonJs declaration

### Performance ###

[Link to jsperf.com](http://jsperf.com/moo-resig-ender-my/31)

### Sources of inspirations ###

- [JavaScript Override Patterns](http://webreflection.blogspot.ie/2010/02/javascript-override-patterns.html "JavaScript Override Patterns")
- [my.class.js](http://jiem.github.io/my-class/ "my.class.js")
- [Objs](https://github.com/tekool/objs/ "Objs")
- [A fresh look at JavaScript Mixins](http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/ "A fresh look at JavaScript Mixins")

### License ###
Copyright © 2013-2014 Sergii Danilov, [pencroff.com](http://pencroff.com "pencroff.com")

MoaJs may be freely distributed under the MIT license.

