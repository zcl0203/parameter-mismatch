var fs = require('fs');
var path = require('path');
var esprima = require('esprima');
var estraverse = require('estraverse');

var call_func_comment = 'call_func_comment.json';
var call_func_file = 'call_func_pair.json';
var call_func_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), call_func_file)));
var file_comment = {};

console.log(call_func_info.length);

for (var call_func_pair of call_func_info) {

    var func_info = call_func_pair.func_info;
    var file = func_info.file;
    var name = func_info.name;

    if (!file_comment[file]) {
        try {
            file_comment[file] = extractFuncComment(file);
        } catch(err) {
            file_comment[file] = [];
            console.log(file);
        }
        
    }

    for (item of file_comment[file]) {
        if (item.func === name) {
            call_func_pair.func_info.comment = item.comment;
        }
    }
}

fs.writeFileSync(path.join(process.cwd(), call_func_comment), JSON.stringify(call_func_info), 'utf-8');

// 获取文件函数定义对应的注释
function extractFuncComment(file = 'E:/research/parameterMismatch/parametermismatch/dataset/atom/src/cursor.js') {
    
    var func_comment_pair = [];
    var ast = esprima.parseScript(fs.readFileSync(file, 'utf-8'), {loc: true, tolerant: true, attachComment: true});
   
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            
            // 普通函数定义 function a() {}
            if (node.type === 'FunctionDeclaration') {
                if (node.leadingComments) {
                    var func = node.id.name;
                    var comment = node.leadingComments.map(comment => comment.value);
                    func_comment_pair.push({'func': func, 'comment': comment});
                }
            }

            // 函数表达式定义 var a = function() {} || var a = new Function() {}
            if (node.type === 'VariableDeclaration') {
                if (node.declarations[0].init && 
                    (node.declarations[0].init.type === 'FunctionExpression' || node.declarations[0].init.type === 'NewExpression') && 
                    node.leadingComments) {
                    var func = node.declarations[0].id.name;
                    var comment = node.leadingComments.map(comment => comment.value);
                    func_comment_pair.push({'func': func, 'comment': comment});
                }
            }
            
            // 类里面的函数 class xx { a() {} }
            if (node.type === 'ClassExpression') {
                var className = node.id.name;
                var body = node.body.body;
                
                for (expression of body) {
                    if (expression.type === 'MethodDefinition' && expression.leadingComments) {
                        
                        var func = className + '.' + expression.key.name;
                        var comment = expression.leadingComments.map(comment => comment.value);
                        func_comment_pair.push({'func': func, 'comment': comment});
                    }
                }
            }
        }
    });

    return func_comment_pair;
}
