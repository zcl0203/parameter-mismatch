var fs = require('fs');
var path = require('path');
var esprima = require('esprima');

var call_func_file = 'call_func_pair.json';
var call_func_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), call_func_file)));

for (var call_func_pair of call_func_info) {

    var func_info = call_func_pair.func_info;
    var file = func_info.file;
    var name = func_info.name;
    var start_line = func_info.start_line;
    var end_line = func_info.end_line;

    // 获取函数对应的注释
    console.log(file);
    var ast = esprima.parseScript(fs.readFileSync(file, 'utf-8'), {loc: true, tolerant: true, comment: true}, function(node) {
        if(node.type === '') {

        }
    });
    console.log(ast);
}