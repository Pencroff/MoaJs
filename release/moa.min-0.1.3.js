/*********************************************
   The MIT License (MIT)
   Copyright (c) 2013 - 2014 Sergii Danilov
   MoaJs - v0.1.3 - 2014-03-23
*********************************************/
!function(){Object.create||(Object.create=function(){function e(){}return function(t){if(1!==arguments.length)throw new Error("Object.create implementation only accepts one parameter.");return e.prototype=t,new e}}());var e,t={},n={},r=function(e,t){var n;if(t){for(n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.toString=t.toString,e.valueOf=t.valueOf,e.toLocaleString=t.toLocaleString}return e},i=function(e,t){var n="Wrong parameters in "+e;throw t&&(n="Wrong parameter "+t+" in "+e),new Error(n,"Moa")},o=function(t,n,r){var i="Type ";if(t===e)throw r===!0&&(i="Mixin type "),new Error(i+n+" not found","Moa")},c=function(e,t){var r,i,c;for(r in t)i=t[r],c=n[i],o(c,i,!0),c.call(e),e[r]=new c;return e},a=function(t,n,i){var o,a,u=i.$single,f=i.$static,s=i.$mixin,l=i.$ctor,$=i.$di,d={};return l!==e?delete i.$ctor:l=function(){},delete i.$single,delete i.$static,delete i.$mixin,delete i.$extend,f!==e&&(a=f.$mixin,a!==e&&(delete f.$mixin,c(l,a)),r(l,f)),s!==e&&(i=r(c({},s),i)),n!==e&&(o=n.$type,i=r(Object.create(n.$ctor.prototype),i)),i.getType=function(){return t},r(d,i),l.prototype=i,l.prototype.constructor=l,u!==e&&u===!0&&!function(){var e=new l;l=function(){return e},l.getInstance=function(){return e}}(),d.$ctor=l,{$type:t,$basetype:o,$mixin:s,$di:$,$ctor:l,$base:d}},u=function(e,n,r){var i,o,c,a,f=!1;n=n||{},n.$current||(n.$current=e);for(i in n){switch(o=n[i],c=typeof o,i){case"$current":switch(c){case"string":o={type:o,instance:"item",lifestyle:"transient"};break;case"object":o.type=e,o.instance||(o.instance="item"),o.lifestyle||"ctor"===o.instance||(o.lifestyle="transient")}break;case"$ctor":o=u(e,o,i),delete o.$current;break;case"$prop":o=u(e,o,i),delete o.$current;break;default:switch(f=!0,c){case"string":a=t[o],a&&(o=a.$di.$current);break;case"object":o.type&&("ctor"===o.instance?delete o.lifestyle:(o.instance||(o.instance="item"),o.lifestyle||(o.lifestyle="transient")))}}r||!f?n[i]=o:(f=!1,n.$prop||(n.$prop={}),n.$prop[i]=o,delete n[i])}return n},f={clear:function(){var e=function(e){var t;for(t in e)delete e[t]};e(t),e(n)},define:function(n,r){var c,f,s,l=arguments.length;switch(l){case 1:c=t[n],o(c,n);break;case 2:switch(typeof r){case"function":f=r().$extend,f!==e?(s=t[f],o(s,f),c=a(n,s,r(s.$base))):c=a(n,e,r(e));break;case"object":if(null===r)return delete t[n],e;f=r.$extend,f!==e&&(s=t[f],o(s,f)),c=a(n,s,r);break;default:i("define","definition")}t[n]=c,t[n].$di=u(n,c.$di);break;default:i("define")}return c.$ctor},resolve:function(e,n){var r,c=t[e],a=arguments.length,u=function(e,t,n){var r,i;for(r in t)i=t[r],e[r]="object"==typeof i?n(i,u):i;return e},f=function(e,t,n,r){var i,o;return r=r||{},o=e.$ctor,o&&(r=u(r,o,n)),i=new t.$ctor(r),o=e.$prop,o&&(i=u(i,o,n)),i},s=function(n,o){var c,a=n.$current;if(a)c=t[a.type];else{if(a=n,c=t[a.type],!c)return n;n=c.$di}switch(a.instance){case"item":switch(a.lifestyle){case"transient":r=f(n,c,s,o);break;case"singleton":a.item||(a.item=f(n,c,s,o)),r=a.item;break;default:i("resolve",e+"::$di::$current::lifestyle")}break;case"ctor":r=c.$ctor;break;default:i("resolve",e+"::$di::$current::instance")}return r};return 1!==a&&2!==a&&i("resolve"),o(c,e),r=s(c.$di,n)},mixin:function(e,t){null!==t?("function"!=typeof t&&i("mixin","definition"),n[e]=t):delete n[e]},getRegistry:function(){var e=function(e){var t,n=[];for(t in e)n.push(t);return n};return{type:e(t),mixin:e(n)}},getTypeInfo:function(e){var n,i=t[e];return o(i,e),n=r({},i),delete n.$ctor,delete n.$base,delete n.$di,n.$di=JSON.parse(JSON.stringify(i.$di)),n}};"undefined"!=typeof define?define("Moa",[],function(){return f}):"undefined"!=typeof window?window.Moa=f:module.exports=f}();
//# sourceMappingURL=moa.min.js.map