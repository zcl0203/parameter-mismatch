var fs = require('fs');
var path = require('path');

var call_func_type_file = 'call_func_type.json';
var call_func_type_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), call_func_type_file)), 'utf-8');
