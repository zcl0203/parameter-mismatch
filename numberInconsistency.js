var fs = require('fs');
var path = require('path');

var call_func_file = 'call_func_info.json';
var call_func_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), call_func_file)), 'utf-8');

var total = 0,
    count = 0;
var tmp_arr = [];
for (var call_func of call_func_info) {
    total++;
    var args = call_func.call_info.args;
    var params = call_func.func_info.params;

    if (args && params && args.length !== params.length) {
        count++;
        tmp_arr.push(call_func);
    }
}

console.log(total,count);
fs.writeFileSync(path.join(process.cwd(), 'numInconsistent.json'), JSON.stringify(tmp_arr), 'utf-8');

