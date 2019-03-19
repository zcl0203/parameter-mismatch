import json
import os
import pandas as pd
import math
import sys

proj = sys.argv[1]
call_func_info_file = 'result/%s/func_with_type.json'%(proj)
predicted_file = 'result/%s/predicted_call.csv'%(proj)

with open(call_func_info_file) as f:
    call_func_list = json.load(f)

predict_info = pd.read_csv(predicted_file)

for pair in call_func_list:

    tmp_args = []

    i = -1
    for lineno in predict_info['line_number']:
        i += 1
        try:
            if (
                (lineno == pair['call_info']['line'])
                & (predict_info['filename'][i] == pair['call_info']['file'])
                & (predict_info['datapoint_type'][i] == 1) 
                & (pair['call_info'].has_key('args'))
                & (len(pair['call_info']['args']) != 0)
            ):
               
                for arg in pair['call_info']['args']:
                    if (predict_info['name'][i] == arg.encode('utf-8')):
                        
                        tmp = dict()
                        tmp['name'] = predict_info['name'][i]
                        if (math.isnan(predict_info['original'][i])):
                            tmp['type'] = ""
                        
                        tmp['predicted'] = dict()
                        tmp['predicted']['prediction'] = predict_info['prediction'][i]
                        tmp['predicted']['top5'] = predict_info['top_5'][i]

                        tmp_args.append(tmp)
        except:
            continue
    if len(tmp_args) != 0:
        pair['call_info']['args'] = tmp_args

output_dir = 'result/%s'%(proj)
out_file_name = 'call_func_with_type'        
with open(os.path.join(output_dir, out_file_name + ".json"),
              'w') as out_file:
        json.dump(call_func_list, out_file)
   

