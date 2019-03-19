var fs = require('fs');
var path = require('path');

var current_path = process.cwd();
var project = 'dataset';
datasetPath = path.join(current_path, project);

detectInconsistency(datasetPath);

function detectInconsistency(projPath){
    var projects = resolvePath(projPath);

    projects.forEach(project => {
        fs.existsSync()

        if (! fs.existsSync(path.join(current_path, '/result', project))) {
            fs.mkdirSync(path.join(current_path, '/result', project));
        }
        if (! fs.existsSync(path.join(current_path, '/result', project, '/understand'))) {
            fs.mkdirSync(path.join(current_path, '/result', project, '/understand'));
        }
        if (! fs.existsSync(path.join(current_path, '/result', project, '/jsdoc_out'))) {
            fs.mkdirSync(path.join(current_path, '/result', project, '/jsdoc_out'));
        }
        if (! fs.existsSync(path.join(current_path, '/result', project, '/raw_csv'))) {
            fs.mkdirSync(path.join(current_path, '/result', project, '/raw_csv'));
        }
        if (! fs.existsSync(path.join(current_path, '/result', project, '/vecs'))) {
            fs.mkdirSync(path.join(current_path, '/result', project, '/vecs'));
        }
        if (! fs.existsSync(path.join(current_path, '/result', project, '/call_func_info'))) {
            fs.mkdirSync(path.join(current_path, '/result', project, '/call_func_info'));
        }
        if (! fs.existsSync(path.join(current_path, '/result', project, '/inconsistency'))) {
            fs.mkdirSync(path.join(current_path, '/result', project, '/inconsistency'));
        }
       
    });
}

function resolvePath(projPath) {
    var project = [];
    var files = fs.readdirSync(projPath);
    files.forEach(item => {
        var fpath = path.join(projPath, item);
        if (fs.statSync(fpath).isDirectory() === true){
            project.push(item);
        } 
    });
    
    return project;
}

