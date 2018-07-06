'use strict';

var vscode = require('vscode');
var path = require('path');
var child_process = require('child_process');

function definitionSearch(document, uuid, tpid){
    return Promise.all([
        nakeDefinitionSearch(document, uuid, tpid)
    ]).then(function(values){
        return values[0];
    })
}

function nakeDefinitionSearch(document,uuid,tpid){
    return new Promise(function(resolve,reject){
        var module = path.join(require.resolve('nak'), "../../bin/nak");
        // var range = document.getWordRangeAtPosition(pos);
        //var word = document.getText(range);
        var pattern = "UUID:"+uuid;
        var cmd = "node "+module+" --ackmate -G \"*"+path.extname(document.fileName)+"\" -d \"*node_modules*\" \""+pattern+"\" "+path.join(document.fileName,"../../../test_spec");

        var output=child_process.execSync(cmd);
        var line_num,fname;
        var lines = output.toString().split('\n');
        for (var i=0;i<lines.length;i++){
            if (lines[i]){
                if(lines[i].search(';')){
                    line_num=lines[i].split(";")[0];
                }
                if(lines[i].match('^:.*')){
                    fname=lines[i].split(":")[1];
                }
            }
        }
        
        //jump to the tpid line
        var pattern_tpid = "TPID:"+tpid
        var cmd_tpid ="node "+module+" --ackmate -G \""+path.basename(fname)+"\" -d \"*node_modules*\" \""+pattern_tpid+"\" "+path.join(fname,"../");
        var output_tpid =child_process.execSync(cmd_tpid);
        
        var lines_tpid = output_tpid.toString().split('\n');
        for (var i=0;i<lines_tpid.length;i++){
            if (lines_tpid[i]){
                if(lines_tpid[i].search(';')){
                    line_num=lines_tpid[i].split(";")[0];
                }
            }
        }
        var location={'line_num':line_num,'fname':fname};
        console.log(location.line_num,location.fname);
        return resolve(location);
        // setTimeout(function(){
        //     resolve([]);
        //     nak.kill();
        // },2000);
        // return nak.kill();
    });
}

exports.definitionSearch=definitionSearch;
