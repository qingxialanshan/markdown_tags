'use strict';

var vscode = require('vscode');
var path = require('path');
var child_process = require('child_process');

function definitionSearch(document, tag){
    return Promise.all([
        nakeDefinitionSearch(document, tag)
    ]).then(function(values){
        return values[0];
    })
}

function nakeDefinitionSearch(document,word){
    return new Promise(function(resolve,reject){
        var module = path.join(require.resolve('nak'), "../../bin/nak");
        // var range = document.getWordRangeAtPosition(pos);
        //var word = document.getText(range);
        var pattern = "::uuid::"+word;
        var cmd = "node "+module+" --ackmate -G \"*"+path.extname(document.fileName)+"\" -d \"*node_modules*\" \""+pattern+"\" "+path.join(document.fileName,"../");

        // var nak = child_process.exec(cmd,function(err,stdout,stderr){
        //     if(err||stderr){
        //         console.log(err,stderr);
        //         return reject(err || stderr);
        //     }
        //     //console.log(stdout);
        //     var line_num,fname;
        //     var lines = stdout.split('\n');
        //     for (var i=0;i<lines.length;i++){
        //         if (lines[i]){
        //             if(lines[i].search(';')){
        //                 line_num=lines[i].split(";")[0];
        //             }
        //             if(lines[i].match('^:.*')){
        //                 fname=lines[i].split(":")[1];
        //             }
        //         }
        //     }
            
        //     var location={'line_num':line_num,'fname':fname};
        //     //return location;
            
        //     resolve(location);
            
        // });
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
            
            var location={'line_num':line_num,'fname':fname};
            //console.log(location);
            return resolve(location);
        // setTimeout(function(){
        //     resolve([]);
        //     nak.kill();
        // },2000);
        // return nak.kill();
    });
}

exports.definitionSearch=definitionSearch;