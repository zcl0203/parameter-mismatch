#!/bin/bash

node script/makeDir.js

project_path=$(cd $(dirname ${BASH_SOURCE[0]}); pwd)
echo $project_path
proj="/dataset/"
proj_path=${project_path}${proj}

dirs=$(ls -l $proj_path |awk '/^d/ {print $NF}')
c=0
for dir in $dirs
do
    projects[c]=$dir
    ((c++))
done
# echo ${#projects[*]}

for project in ${projects[*]}
do
    echo $project

    # 1.understand to call_func_info
    /home/zcl/Downloads/scitools/bin/linux64/uperl script/getCallGraph.pl $project
    node script/extractCallgraph.js $project
    node script/extractFuncInfo.js $project

    # 2.infer type
    node script/generateConfig.js $project

    cd NL2Type

    conf1="scripts/configs/"$project"_func.json"
    conf2="scripts/configs/"$project"_call.json"
    python2 scripts/runner.py --config $conf1
    python2 scripts/runner.py --config $conf2

    cd ..

    python2 script/predictTypeOfDef.py $project
    python2 script/predictTypeOfCall.py $project


    # 3.detect inconsistency
    node script/inconsistency.js $project

done

