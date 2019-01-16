var fs = require('fs');
var path = require('path');
var esprima = require('esprima');
var estraverse = require('estraverse');

var call_func_info_file = 'call_func_info.json';
var call_func_file = 'call_func_pair.json';
var call_func_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), call_func_file)));

var file_func_info = {};
for (var call_func_pair of call_func_info) {

    var func_info = call_func_pair.func_info;
    var file = func_info.file;
    var name = func_info.name;
    var start_line = func_info.start_line;
    var end_line = func_info.end_line;

    if (!file_func_info[file]) {
        try {
            file_func_info[file] = extractFuncInfo(file);
        } catch (err) {
            file_func_info[file] = [];
            console.log(file);
        }
    }

    for (item of file_func_info[file]) {
        if (item.start_line === start_line && item.end_line === end_line) {
            call_func_pair.func_info.comment = item.comment;
            call_func_pair.func_info.params = item.params;
        }
    }
}

// 对每一个调用函数提取对应的信息，包括函数参数，所在函数的代码片段以及注释信息
for (var call_func_pair of call_func_info) {

    var call_info = call_func_pair.call_info;
    var file = call_info.file;
    var name = call_info.name;
    var line = call_info.line;
    var func_start_line = call_info.func_start_line;
    var func_end_line = call_info.func_end_line;

    var res;
    try {
        res = extractCallInfo(file, name, line, func_start_line, func_end_line);
    } catch (err) {
        console.log(file);
    }

    if (res) {
        if (res.comment) {
            console.log(res.comment);
        }

        call_info.args = res.args;
        call_info.comment = res.comment;
        call_info.code = res.code;
    }
}

fs.writeFileSync(path.join(process.cwd(), call_func_info_file), JSON.stringify(call_func_info), 'utf-8');

// 获取文件函数定义对应的注释以及参数
function extractFuncInfo(file = 'E:/research/parameterMismatch/parametermismatch/dataset/atom/src/initialize-benchmark-window.js') {

    var func_comment_pair = [];
    var ast = esprima.parseScript(fs.readFileSync(file, 'utf-8'), {
        loc: true,
        tolerant: true,
        attachComment: true
    });

    estraverse.traverse(ast, {
        enter: function (node, parent) {

            // case1: 普通函数定义 function a() {}
            if (node.type === 'FunctionDeclaration') {
                var func = node.id.name,
                    comment = [],
                    params = [];

                if (node.leadingComments) {
                    comment = node.leadingComments.map(comment => comment.value);
                }
                if (node.params.length) {
                    params = node.params.map(param => resolveParam(param));
                }
                func_comment_pair.push({
                    'func': func,
                    'comment': comment,
                    'params': params,
                    'start_line': node.loc.start.line,
                    'end_line': node.loc.end.line
                });
            }

            // case2: 函数表达式定义 var a = function() {} || var a = new Function() {}
            if (node.type === 'VariableDeclaration' && node.declarations[0].init && (node.declarations[0].init.type === 'FunctionExpression')) {
                var func = node.declarations[0].id.name,
                    comment = [],
                    params = [];

                if (node.leadingComments) {
                    comment = node.leadingComments.map(comment => comment.value);
                }
                if (node.declarations[0].init.params.length) {
                    params = node.declarations[0].init.params.map(param => resolveParam(param));
                }

                func_comment_pair.push({
                    'func': func,
                    'comment': comment,
                    'params': params,
                    'start_line': node.loc.start.line,
                    'end_line': node.loc.end.line
                });
            }

            // case3: 定义类内的函数 class xx { a() {} }
            if (node.type === 'ClassDeclaration') {
                var className = node.id.name;
                var body = node.body.body;

                for (expression of body) {
                    if (expression.type === 'MethodDefinition') {
                        var func = className + '.' + expression.key.name,
                            comment = [],
                            params = [];

                        if (expression.leadingComments) {
                            comment = expression.leadingComments.map(comment => comment.value);
                        }

                        if (expression.value.params.length) {
                            params = expression.value.params.map(param => resolveParam(param));
                        }

                        func_comment_pair.push({
                            'func': func,
                            'comment': comment,
                            'params': params,
                            'start_line': expression.loc.start.line,
                            'end_line': expression.loc.end.line
                        });
                    }
                }
            }

            // case4: 类里面的函数 module.exports = class xx { a() {} }
            if (node.type === 'ClassExpression') {
                var className = node.id.name;
                var body = node.body.body;

                for (expression of body) {
                    if (expression.type === 'MethodDefinition') {
                        var func = className + '.' + expression.key.name,
                            comment = [],
                            params = [];

                        if (expression.leadingComments) {
                            comment = expression.leadingComments.map(comment => comment.value);
                        }

                        if (expression.value.params.length) {
                            params = expression.value.params.map(param => resolveParam(param));
                        }

                        func_comment_pair.push({
                            'func': func,
                            'comment': comment,
                            'params': params,
                            'start_line': expression.loc.start.line,
                            'end_line': expression.loc.end.line
                        });
                    }
                }
            }

            // case5: 赋值表达式 a/console.log = function (...args) { }
            if (node.type === 'AssignmentExpression' && node.right.type === 'FunctionExpression') {

                var func,
                    comment = [],
                    params = [];

                func = resolveFuncName(node.left);
                if (parent.type === 'ExpressionStatement' && parent.leadingComments) {
                    comment = parent.leadingComments.map(comment => comment.value);
                }
                if (node.right.params.length) {
                    params = node.right.params.map(param => resolveParam(param));
                }
                func_comment_pair.push({
                    'func': func,
                    'comment': comment,
                    'params': params,
                    'start_line': node.loc.start.line,
                    'end_line': node.loc.end.line
                });
            }

            // case6: object内函数，a = { func(x) {} }/ var a = { func(x) {} } ObjectExpression
            if (node.type === 'ObjectExpression') {
                for (property of node.properties) {
                    if (property.value.type === 'FunctionExpression') {
                        var func,
                            comment = [],
                            params = [];

                        func = resolveFuncName(property.key);
                        if (property.leadingComments) {
                            comment = property.leadingComments.map(comment => comment.value);
                        }
                        if (property.value.params.length) {
                            params = property.value.params.map(param => resolveParam(param));
                        }
                        func_comment_pair.push({
                            'func': func,
                            'comment': comment,
                            'params': params,
                            'start_line': property.loc.start.line,
                            'end_line': property.loc.end.line
                        });
                    }
                }
            }
        }
    });

    return func_comment_pair;
}

// 获取文件函数调用时的参数以及该函数调用所在的函数以及该函数的注释
function extractCallInfo(file, name, line, func_start_line, func_end_line) {

    var ast = esprima.parseScript(fs.readFileSync(file, 'utf-8'), {
        loc: true,
        tolerant: true,
        attachComment: true
    });

    var callInfo = {};

    estraverse.traverse(ast, {
        enter: function (node, paranet) {
            if (node.loc.start.line === func_start_line && node.loc.end.line === func_end_line) {
                var comment, code;
                if (node.leadingComments) {
                    comment = node.leadingComments.map(comment => comment.value);
                }
                code = node;

                estraverse.traverse(node, {
                    enter: function (node, parent) {
                        if (node.type === 'CallExpression') {
                            var func,
                                args = [];

                            func = resolveFuncName(node.callee).split('.').pop();
                            args = node.arguments.map(arg => resolveParam(arg));
                            if (node.loc.start.line === line && node.loc.end.line === line) {
                                callInfo.args = args;
                                callInfo.comment = comment;
                                callInfo.code = code;
                                this.break();
                            }
                        }
                    }
                });
                this.break();
            }
        }
    });

    return callInfo;
}

function resolveFuncName(obj) {
    var name = [];
    if (obj.type === 'Identifier') {
        name.push(obj.name);
    } else if (obj.type === 'MemberExpression') {
        name.push(resolveFuncName(obj.object));
        name.push(obj.property.name);
    }

    name = name.join('.');
    return name;
}

function resolveParam(obj) {
    var param;

    if (obj.type === 'Literal') {
        param = {
            'type': typeof (obj.value)
        };
    }
    if (obj.type === 'RestElement') {
        param = obj.argument.name;
    }

    if (obj.type === 'Identifier') {
        param = obj.name;
    }

    if (obj.type === 'MemberExpression') {
        param = resolveFuncName(obj);
    }

    // 函数定义时参数可能情况
    if (obj.type === 'AssignmentPattern') {
        if (obj.left.type === 'Identifier') {
            param = obj.left.name;
        } else if (obj.left.type === 'ObjectPattern') {
            var tmp = [];
            for (prop of obj.left.properties) {
                tmp.push(prop.key.name);
            }
            param = tmp;
        }
    }

    if (obj.type === 'ObjectPattern') {
        var tmp = [];
        for (prop of obj.properties) {
            tmp.push(prop.key.name);
        }
        param = tmp;
    }

    return param;
}