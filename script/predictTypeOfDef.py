import json
import os
import pandas as pd
import sys
import math

proj = sys.argv[1]
call_func_info_file = 'result/%s/call_func_info/call_func_info.json'%(proj)
predicted_file = 'result/%s/predicted.csv'%(proj)

with open(call_func_info_file) as f:
    call_func_list = json.load(f)

predict_info = pd.read_csv(predicted_file)

for pair in call_func_list:

    tmp_params = []

    i = -1
    for lineno in predict_info['line_number']:
        i += 1
        try:
            if (
                (lineno == pair['func_info']['start_line'])
                & (predict_info['filename'][i] == pair['func_info']['file'])
                & (predict_info['datapoint_type'][i] == 1) 
                & (pair['func_info'].has_key('params'))
                & (len(pair['func_info']['params']) != 0)
            ):
                
                for param in pair['func_info']['params']:
                   
                    if (predict_info['name'][i] == param.encode('utf-8')):
                        
                        tmp = dict()
                        tmp['name'] = predict_info['name'][i]
                        
                        # if math.isnan(predict_info['original'][i]):
                        #     tmp['type'] = ""
                            
                        # else:
                        tmp['type'] = predict_info['original'][i]
                       
                        
                        tmp['predicted'] = dict()
                        tmp['predicted']['prediction'] = predict_info['prediction'][i]
                        tmp['predicted']['top5'] = predict_info['top_5'][i]

                        tmp_params.append(tmp)
                        
        except:
            continue
    if len(tmp_params) != 0:
        pair['func_info']['params'] = tmp_params

output_dir = '/home/zcl/Desktop/parametermismatch/result/%s'%(proj)
out_file_name = 'func_with_type'        
print output_dir
with open(os.path.join(output_dir, out_file_name + ".json"),
              'w') as out_file:
        json.dump(call_func_list, out_file)
   

