var fs = require('fs');
var path = require('path');

var call_func_file = 'call_func_info.json';
var call_func_info = JSON.parse(fs.readFileSync(path.join(process.cwd(), call_func_file)), 'utf-8');


// 1.统计参数名字的长度
var argsLen = {};
var paramsLen = {};
for (var call_func of call_func_info) {
    var args = call_func.call_info.args ? call_func.call_info.args : null;
    var params = call_func.func_info.params ? call_func.func_info.params : null;

    if (args && params && args.length === params.length) {
        for (var i = 0; i < args.length; i++) {
            if (args[i]) {
                if (!argsLen[args[i].length]) {
                    argsLen[args[i].length] = 0;
                }
                argsLen[args[i].length]++;
            }

            if (params[i]) {
                if (!paramsLen[params[i].length]) {
                    paramsLen[params[i].length] = 0;
                }
                paramsLen[params[i].length]++;
            }
        }
    }
}

var lenFile = 'argNameLen.csv';
var title = ['length', 'number'];
fs.writeFileSync(path.join(process.cwd(), lenFile), title, 'utf-8');
fs.appendFileSync(path.join(process.cwd(), lenFile), '\n', 'utf-8');

for (var item in argsLen) {
    var data = [item, argsLen[item]];
    fs.appendFileSync(path.join(process.cwd(), lenFile), data, 'utf-8');
    fs.appendFileSync(path.join(process.cwd(), lenFile), '\n', 'utf-8');
}

var file = 'paramNameLen.csv';
fs.writeFileSync(path.join(process.cwd(), file), title, 'utf-8');
fs.appendFileSync(path.join(process.cwd(), file), '\n', 'utf-8');

for (var item in paramsLen) {
    var data = [item, paramsLen[item]];
    fs.appendFileSync(path.join(process.cwd(), file), data, 'utf-8');
    fs.appendFileSync(path.join(process.cwd(), file), '\n', 'utf-8');
}

// 2.统计名字的相似性
var similarity = [];
for (var call_func of call_func_info) {
    var args = call_func.call_info.args ? call_func.call_info.args : null;
    var params = call_func.func_info.params ? call_func.func_info.params : null;

    if (args && params && args.length === params.length) {
        for (var i = 0; i < args.length; i++) {
            if (args[i] && params[i] && typeof args[i] === 'string' && typeof params[i] === 'string') {
                var sim = strSimilarity2Percent(args[i], params[i]);
                similarity.push([args[i], params[i], sim]);
            }
        }
    }
}

var simFile = 'similarity.csv';

var title = ['args', 'params', 'similarity'];
fs.writeFileSync(path.join(process.cwd(), simFile), title, 'utf-8');
fs.appendFileSync(path.join(process.cwd(), simFile), '\n', 'utf-8');

for (var sim of similarity) {
    fs.appendFileSync(path.join(process.cwd(), simFile), sim, 'utf-8');
    fs.appendFileSync(path.join(process.cwd(), simFile), '\n', 'utf-8');
}

//两个字符串的相似程度，并返回相差字符个数
function strSimilarity2Number(s, t) {
    var n = s.length,
        m = t.length,
        d = [];
    var i, j, s_i, t_j, cost;
    if (n == 0) return m;
    if (m == 0) return n;
    for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
    }

    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
        s_i = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            t_j = t.charAt(j - 1);
            if (s_i == t_j) {
                cost = 0;
            } else {
                cost = 1;
            }
            d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[n][m];
}
//两个字符串的相似程度，并返回相似度百分比
function strSimilarity2Percent(s, t) {
    var l = s.length > t.length ? s.length : t.length;
    var d = strSimilarity2Number(s, t);
    return (1 - d / l).toFixed(4);
}

function Minimum(a, b, c) {
    return a < b ? (a < c ? a : c) : (b < c ? b : c);
}