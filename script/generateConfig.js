var fs = require('fs');
var path = require('path');
var esprima = require('esprima');
var estraverse = require('estraverse');

var curr_path = process.cwd();
var args = process.argv.splice(2)[0];

var predictDefconfig = [];
predictDefconfig.push({
    "module": "jsdoc_extractor",
    "config": {
        "input_dir": path.join(curr_path, "dataset", args),
        "output_dir": path.join(curr_path, "result", args, "jsdoc_out")
    }
});

predictDefconfig.push({
    "module": "jsdoc_to_csv",
    "config": {
        "input_dir": path.join(curr_path, "result", args, "jsdoc_out"),
        "output_dir": path.join(curr_path, "result", args, "raw_csv")
    }
});

predictDefconfig.push({
    "module": "csv_to_vecs",
    "config": {
        "batch": false,
        "input_file_path": path.join(curr_path, "result", args, "raw_csv/data_cleaned0.csv"),
        "output_dir": path.join(curr_path, "result", args, "vecs"),
        "data_output_file_path": path.join(curr_path, "result", args, "vecs/vecs_test"),
        "output_dir_types": path.join(curr_path, "result", args, "vecs"),
        "out_name": "train",
        "word2vec_code": "data/paper/word2vec_model_code.bin",
        "word2vec_language": "data/paper/word2vec_model_language.bin",
        "type_output_file_path": path.join(curr_path, "result", args, "vecs/types"),
        "vector_length": 100,
        "save_Y": false,
        "types_count": 1000,
        "features": {
            "datapoint_type": 1,
            "cleaned_name": 6,
            "comment": 12,
            "return_param_comment": 10,
            "params": 10
        }
    },
    "meta": {
        "_meta_types_count": 1000,
        "_meta_data_type": "test"
    }
});

predictDefconfig.push({
    "module": "predict",
    "config": {
        "x_path": path.join(curr_path, "result", args, "vecs/vecs_test.npy"),
        "y_path": path.join(curr_path, "result", args, "vecs/types.npy"),
        "types_map": "data/paper/vecs/types.json",
        "input_file": path.join(curr_path, "result", args, "raw_csv/data_cleaned0.csv"),
        "evaluations_output_file": path.join(curr_path, "result", args, "predicted.csv"),
        "model_path": "models/model_paper.h5"
    }
});

predictDefconfig.push({
    "module": "enrich_results",
    "config": {
        "results_file": path.join(curr_path, "result", args, "predicted.csv"),
        "output_file": path.join(curr_path, "result", args, "predicted.csv"),
        "data_file": path.join(curr_path, "result", args, "raw_csv/data_cleaned0.csv")
    }
});


fs.writeFileSync(path.join(curr_path, "NL2Type/scripts/configs", args + '_func.json'), JSON.stringify(predictDefconfig));


var predictCallConfig = [];
predictCallConfig.push({
    "module": "call_json_tocsv",
    "config": {
        "input_dir": path.join(curr_path, "result", args, "call_func_info"),
        "output_dir": path.join(curr_path, "result", args, "raw_csv")
    }
});
predictCallConfig.push({
    "module": "csv_to_vecs",
    "config": {
        "batch": false,
        "input_file_path": path.join(curr_path, "result", args, "raw_csv/call_data_cleaned0.csv"),
        "output_dir": path.join(curr_path, "result", args, "vecs"),
        "data_output_file_path": path.join(curr_path, "result", args, "vecs/vecs_test_call"),
        "output_dir_types": path.join(curr_path, "result", args, "vecs"),
        "out_name": "train",
        "word2vec_code": "data/paper/word2vec_model_code.bin",
        "word2vec_language": "data/paper/word2vec_model_language.bin",
        "type_output_file_path": path.join(curr_path, "result", args, "vecs/types_call"),
        "vector_length": 100,
        "save_Y": false,
        "types_count": 1000,
        "features": {
            "datapoint_type": 1,
            "cleaned_name": 6,
            "comment": 12,
            "return_param_comment": 10,
            "params": 10
        }
    },
    "meta": {
        "_meta_types_count": 1000,
        "_meta_data_type": "test"
    }
});
predictCallConfig.push({
    "module": "predict",
    "config": {
        "x_path": path.join(curr_path, "result", args, "vecs/vecs_test_call.npy"),
        "y_path": path.join(curr_path, "result", args, "vecs/types_call.npy"),
        "types_map": "data/paper/vecs/types.json",
        "input_file": path.join(curr_path, "result", args, "raw_csv/call_data_cleaned0.csv"),
        "evaluations_output_file": path.join(curr_path, "result", args, "predicted_call.csv"),
        "model_path": "models/model_paper.h5"
    }
});
predictCallConfig.push({
    "module": "enrich_results",
    "config": {
        "results_file": path.join(curr_path, "result", args, "predicted_call.csv"),
        "output_file": path.join(curr_path, "result", args, "predicted_call.csv"),
        "data_file": path.join(curr_path, "result", args, "raw_csv/call_data_cleaned0.csv")
    }
});


fs.writeFileSync(path.join(curr_path, "NL2Type/scripts/configs", args + '_call.json'), JSON.stringify(predictCallConfig));
