var fs = require('fs');
var path = require('path');

var call_func_file = 'call_func_type.json';
var call_func_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), call_func_file)), 'utf-8');

var title = ['file', 'name', 'start_line', 'end_line', 'comment', 'params'];
fs.writeFileSync(path.join(process.cwd(), 'commentType.csv'), title, 'utf-8');
fs.appendFileSync(path.join(process.cwd(), 'commentType.csv'), '\n', 'utf-8');

for (var call_func of call_func_info) {
    if (call_func.func_info.comment.length) {
        var params = call_func.func_info.params.map(param => {
            return param.name + ":" + param.type.join(","); 
        }).join(";");
        var arr = [
            call_func.func_info.file,
            call_func.func_info.name,
            call_func.func_info.start_line,
            call_func.func_info.end_line,
            '"' + call_func.func_info.comment.join(".") + '"',
            '"' + params + '"'
        ];
        
        fs.appendFileSync(path.join(process.cwd(), 'commentType.csv'), arr, 'utf-8');
        fs.appendFileSync(path.join(process.cwd(), 'commentType.csv'), '\n', 'utf-8');
    }
}

