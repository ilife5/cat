//向avalon添加add方法
require('avalon');

function add(){
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
        sum += args[i++];
    }
    return sum;
}

avalon.add = add;