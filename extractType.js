var fs = require('fs');
var path = require('path');

var call_func_file = 'call_func_info.json';
var call_func_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), call_func_file)));
var type = ['String', 'Number', 'Boolean', 'Object', 'Array', 'Function', 'Optional', 'optional'];
var call_func_type_file = 'call_func_type.json';

for (var call_func of call_func_info) {

    var func_info = call_func.func_info;
    if (func_info.params && func_info.params.length && func_info.comment.length) {

        var params = [];
        for (var param of func_info.params) {
            var name = param,
                tmp = [];

            for (var comm of func_info.comment) {
                if (comm.indexOf(param) !== -1) {
                    for (var t of type) {
                        if (comm.indexOf(t) !== -1) {
                            tmp.push(t);
                        }
                    }
                }
            }
            params.push({
                name: name,
                type: tmp
            });
        }
        call_func.func_info.params = params;
    }
}

fs.writeFileSync(path.join(process.cwd(), call_func_type_file), JSON.stringify(call_func_info), 'utf-8');