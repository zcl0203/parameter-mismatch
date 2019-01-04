var fs = require('fs');
var path = require('path');

var funcInfoFile = 'function_info.json';
var callInfoFile = 'call_info.json';
var callFunFile = 'call_func_pair.json';

var funcInfo = JSON.parse(fs.readFileSync(funcInfoFile));
var callInfo = JSON.parse(fs.readFileSync(callInfoFile));

var funcInfoMap = {};
var funcInfoMapTotal = {};

for (var func of funcInfo) {
    if (func.name.indexOf('unnamed_function') === -1) {
        funcInfoMap[func.id] = func;
    }
    funcInfoMapTotal[func.id] = func;
}
for (call of callInfo) {
    if (funcInfoMapTotal[call.id]) {
        call.func_location = funcInfoMapTotal[call.id].name;
        call.func_start_line = funcInfoMapTotal[call.id].start_line;
        call.func_end_line = funcInfoMapTotal[call.id].end_line;
    }
}
var call_func_pair = [];
for (call of callInfo) {
    var pair = {}
    var func = funcInfoMap[call.call_func_id];
    if (func) {
        pair.call_info = {};
        pair.call_info.file = call.file;
        pair.call_info.name = call.name;
        pair.call_info.line = call.line;

        pair.call_info.func_location = call.func_location;
        pair.call_info.func_start_line = call.func_start_line;
        pair.call_info.func_end_line = call.func_end_line;


        pair.func_info = {};
        pair.func_info.file = func.file;
        pair.func_info.name = func.name;
        pair.func_info.start_line = func.start_line;
        pair.func_info.end_line = func.end_line;

        call_func_pair.push(pair);
    }
}
console.log(call_func_pair.length);
fs.writeFileSync(path.join(process.cwd(), callFunFile), JSON.stringify(call_func_pair), 'utf-8');