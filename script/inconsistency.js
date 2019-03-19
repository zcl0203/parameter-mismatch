var fs = require('fs');
var path = require('path');

var curr_path = process.cwd();
var args = process.argv.splice(2)[0];
var inputFile = path.join(curr_path, "result", args, "call_func_with_type.json");

var func_list = JSON.parse(fs.readFileSync(inputFile));
console.log(func_list.length);

// 1.number Inconsistency
var num = 0;
for (var func of func_list) {
   
    func_info = func.func_info;
    call_info = func.call_info;
    
    if (func_info.params && call_info.args) {
        if (func_info.params.length && call_info.args.length) {
            if (func_info.params.length !== call_info.args.length) {
                console.log('number inconsistency');
                num += 1;
            }
        }
    }
}
console.log(args, ': number inconsistency, ', num);

// 2.type inconsistency
var inconsis_call_func = [];
var top1_type_num = 0;
for (var func of func_list) {
    func_info = func.func_info;
    call_info = func.call_info;
    
    if (func_info.params && call_info.args) {
        if (func_info.params.length & call_info.args.length) {
            if (func_info.params.length === call_info.args.length) {
                for (var i = 0; i < func_info.params.length; i++) {
                    if (func_info.params[i].predicted && call_info.args[i] && call_info.args[i].predicted) {
                        if (func_info.params[i].predicted.prediction !== call_info.args[i].predicted.prediction) {
                            top1_type_num += 1;
                            inconsis_call_func.push(func);
                        }
                    }
                }
            }
        }
    }
}
console.log(args, ': top1 type inconsistency, ', top1_type_num);
top1File = path.join(curr_path, 'result', args, "inconsistency/top1_inconsistency.json");
fs.writeFileSync(top1File, JSON.stringify(inconsis_call_func), 'utf-8');