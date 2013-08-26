
/**
 * Created with JetBrains WebStorm.
 * Project: MoaJs
 * User: Pencroff
 * Date: 8/21/13
 * Time: 6:46 PM
 */
/*global define:true*/

define('add',[], function () {
    
    return function (a, b) {
        return a + b;
    };
});
/**
 * Created with JetBrains WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 8/21/13
 * Time: 6:49 PM
 */
/*global define:true*/
define('mult',['add'], function (add) {
    
    return function (a, b) {
        var result = 0,
            i;
        for (i = 0; i < a; i += 1) {
            result = add(result, b);
        }
        return result;
    };
});



/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 21.08.2013
 * Time: 23:17
 */
/*global define:true*/
define('math', ['add', 'mult'], function (add, mult) {
    
    var text = document.getElementsByTagName('body')[0].innerHTML;
    text += add(8, 7);
    text += '</br>'
    text += mult(8, 7);
    document.getElementsByTagName('body')[0].innerHTML = text;
});
