![MoaJs](https://raw.github.com/Pencroff/MoaJs/master/extras/moa-logo-web.png "MoaJs") MoaJs 
=====

ExtJs sintaxis for implementation object inheritance, static methods / properties, mixins and less then 2kB minified JavaScript code (again bicycle) :) 

### Documentation ###

- **MoaJs API**
		
	- `define` - declare new object type / get constructor by type name
	- `mixin` - declare new mixin type
	- `getType()` - predefined exemplar method, which return declared type name  


- **Object declaration**

Declaration without $base closure
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
Declaration with $base closure
```javascript
	// Moa.define($name, $function)
	// $name - type name
	// $function - function with declaration fields and methods, has $base parameter, for parrent implementation
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

- **Inheritance declaration**
- **Using `$base` closure**
- **Static methods declaration**
- **Mixins decraration**
- **Singleton**

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

