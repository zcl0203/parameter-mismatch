var fs = require('fs');
var path = require('path');

var func_type_file = 'call_func_type.json';
var func_type_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), func_type_file)));
var func_type_total_file = 'func_type_total.json';
var func_type_total = [];

for (var call_func_info of func_type_info) {
    if (call_func_info.func_info.comment && call_func_info.func_info.comment.length && call_func_info.func_info.params.length) {
        func_type_total.push(call_func_info);
    }
}

console.log(func_type_total.length);
fs.writeFileSync(path.join(process.cwd(), func_type_total_file), JSON.stringify(func_type_total), 'utf-8');
