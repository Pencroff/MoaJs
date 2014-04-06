![MoaJs](https://raw.github.com/Pencroff/MoaJs/master/extras/moa-logo-web.png "MoaJs") MoaJs 
=====

ExtJs syntax for declaration object inheritance, mixins, static methods / properties / mixins, singleton declaration and IoC container out of the box and near 3,8kB minified JavaScript code and 1,6kB gzip. You can see **current** version MoaJs in root and **release** version in `release` folder.

## Documentation ##

- **MoaJs API**

    - `clear` - clear all declared types and mixins
	- `define` - declare object type / get constructor by type name
	- `resolve` - get instance by type name with resolved properties, prototype fields and constructor injection
	- `mixin` - declare mixin type
	- `getType()` - predefined exemplar method, which return declared type name
	- `getRegistry()` - return object with arrays of types and mixins
	- `getTypeInfo()` - return internal information about declared type


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

- IoC implementation: property, prototype and constructor injection
- delete mixins `Moa.mixixn('mix', null)`
- `getTypeInfo` - internal information about type
- `clear` - delete all declarations
- create documentation as comments for JsDoc. You can find on [Documentation](http://pencroff.github.io/MoaJs/)

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

[Performance IoC](http://jsperf.com/moajs-ioc)

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

