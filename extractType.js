var fs = require('fs');
var path = require('path');

var call_func_file = 'call_func_info.json';
var call_func_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), call_func_file)), 'utf-8');
var call_func_type_file = 'call_func_type.json';
var type = ['string', 'number', 'boolean', 'object', 'null', 'undefined', 'array', 'function', 'optional'];
var returnWords = ['return', 'returns'];
var call_func_type_info = [];

for (var call_func of call_func_info) {

    var call_info = call_func.call_info;
    var func_info = call_func.func_info;

    if (func_info.params && func_info.params.length && func_info.comment.length) {

        var params = [],
            retType = [];
        for (var param of func_info.params) {
            var name = param,
                tmp = [];

            for (var comm of func_info.comment) {
                var ret = false;
                for (var retword of returnWords) {
                    if (comm.toLowerCase().indexOf(retword) !== -1) {
                        ret = true;
                    }
                }
                if (ret) {
                    for (var t of type) {
                        if (comm.toLowerCase().indexOf(t) !== -1) {
                            if (retType.indexOf(t) === -1) {
                                retType.push(t);
                            }
                        }
                    }
                } else if (comm.indexOf(param) !== -1) {
                    for (var t of type) {
                        if (comm.toLowerCase().indexOf(t) !== -1) {
                            if (tmp.indexOf(t) === -1) {
                                tmp.push(t);
                            }
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
        call_func.func_info.return_type = retType;
        call_func_type_info.push(call_func);
    }

    if (call_info.args && call_info.args.length && call_info.comment) {
        var args = [];
        for (var param of call_info.args) {
            var name = param,
                tmp = [];

            for (var comm of call_info.comment) {
                var ret = false;
                for (var retword of returnWords) {
                    if (comm.toLowerCase().indexOf(retword) !== -1) {
                        ret = true;
                    }
                }
               if (comm.indexOf(param) !== -1) {
                    for (var t of type) {
                        if (comm.toLowerCase().indexOf(t) !== -1) {
                            if (tmp.indexOf(t) === -1) {
                                tmp.push(t);
                            }
                        }
                    }
                }
            }

            args.push({
                name: name,
                type: tmp
            });
        }
        call_func.call_info.args = args;
        call_func.call_info.return_type = retType;
        call_func_type_info.push(call_func);
    }
}

fs.writeFileSync(path.join(process.cwd(), call_func_type_file), JSON.stringify(call_func_type_info), 'utf-8');

