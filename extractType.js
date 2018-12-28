var fs = require('fs');
var path = require('path');

var call_func_file = 'call_func_comment.json';
var call_func_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), call_func_file)));

var i = 0;
for (var call_func of call_func_info) {
    var func_info = call_func.func_info;
    if (func_info.params.length) {
        if (func_info.comment.length) {
            i++;
        }
    }
}
console.log(i);

