import json

import os
import pandas as pd
import preprocess_raw_data as pp
import nltk

nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')
nltk.download('wordnet')

def invoke(config):
    files = [os.path.join(dp, f) for dp, dn, filenames in os.walk(config['input_dir']) for f in filenames]

    for file_index, input_file in enumerate(files):
        print ("processing file %d/%d" % (file_index + 1, len(files)))
        pass
        with open(input_file) as f:
            functions_list = json.load(f)

        df = pd.DataFrame()

        type = []
        name = []
        datapoint_type = []
        comment = []
        cleaned_comment = []
        returnParam_comment = []
        params = []
        line_numbers = []
        cleaned_names = []
        filename_list = []

        for index, function in enumerate(functions_list):
            call_info = function['call_info']
            line_num = call_info['line']
            filename = call_info['file']
            func = call_info['name']

            if 'args' in call_info:
                for arg in call_info['args']:
                    params.append("")
                    returnParam_comment.append("")
                    datapoint_type.append(1)
                    line_numbers.append(line_num)
                    filename_list.append(filename)
                    
                    if arg == None:
                        type.append("None")
                        name.append("")
                        cleaned_names.append("")
                    elif isinstance(arg, dict):
                        type.append(arg['type'])
                        name.append("")
                        cleaned_names.append("")
                    elif isinstance(arg.encode('utf-8'), str):
                        type.append("")
                        name.append(arg)
                        cleaned_name = pp.lemmatize\
                                (pp.remove_punctuation_and_linebreaks
                                (pp.lemmatize
                                (pp.tokenize
                                (pp.replace_digits_with_space(arg)))))
                        cleaned_names.append(cleaned_name)
                    else:
                        type.append("")
                        name.append("")
                        cleaned_names.append("")

                    
                    comment.append(func)
                    cleaned_comment.append(
                        pp.lemmatize\
                        (pp.remove_punctuation_and_linebreaks
                        (pp.lemmatize
                        (pp.tokenize
                        (pp.replace_digits_with_space(func))))))
                    
                    df = pd.DataFrame.from_dict({"comment": cleaned_comment,
                                     "name": name,
                                     "cleaned_name":cleaned_names,
                                     "filename":filename_list,
                                     "line_number":line_numbers,
                                     "params":params,
                                     "type":type,
                                     "datapoint_type":datapoint_type,
                                     "return_param_comment": returnParam_comment})
                    df.to_csv(os.path.join(config["output_dir"], "call_data_cleaned" + str(file_index) + ".csv"), encoding='utf-8')









            
            
