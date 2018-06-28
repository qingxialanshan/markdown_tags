"use strict";
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');
var search_1=require('./search');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "vscode-file-peek" is now active!');
    var config = vscode.workspace.getConfiguration('file_peek');
    var active_languages = config.get('activeLanguages');
    var search_file_extensions = config.get('searchFileExtensions');
    /*
    vscode.languages.getLanguages().then((languages: string[]) => {
       console.log("Known languages: " + languages);
    });
    */
    var peek_filter = active_languages.map(function (language) {
        return {
            language: language,
            scheme: 'file'
        };
    });
    // Register the definition provider
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(peek_filter, new PeekFileDefinitionProvider(search_file_extensions)));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
/**
 * Provide the lookup so we can peek into the files.
 */
var PeekFileDefinitionProvider = (function () {
    function PeekFileDefinitionProvider(fileSearchExtensions) {
        if (fileSearchExtensions === void 0) { fileSearchExtensions = []; }
        this.fileSearchExtensions = [];
        this.fileSearchExtensions = fileSearchExtensions;
    }
    /**
     * Return list of potential paths to check
     * based upon file search extensions for a potential lookup.
     */
    PeekFileDefinitionProvider.prototype.getPotentialPaths = function (lookupPath) {
        var potential_paths = [lookupPath];
        // Add on list where we just add the file extension directly
        this.fileSearchExtensions.forEach(function (extStr) {
            potential_paths.push(lookupPath + extStr);
        });
        // if we have an extension, then try replacing it.
        var parsed_path = path.parse(lookupPath);
        if (parsed_path.ext !== "") {
            this.fileSearchExtensions.forEach(function (extStr) {
                var new_path = path.format({
                    base: parsed_path.name + extStr,
                    dir: parsed_path.dir,
                    ext: extStr,
                    name: parsed_path.name,
                    root: parsed_path.root
                });
                potential_paths.push(new_path);
            });
        }
        return potential_paths;
    };
    PeekFileDefinitionProvider.prototype.provideDefinition = function (document, position, token) {
        // todo: make this method operate async
        var working_dir = path.dirname(document.fileName);
        var word = document.getText(document.getWordRangeAtPosition(position));
        var line = document.lineAt(position);
        console.log('====== peek-file definition lookup ===========');
        console.log('word: ' + word);
        console.log('line: ' + line.text);

        var module = path.join(require.resolve('nak'), "../../bin/nak");
        var pattern = "::uuid::"+word;
        var cmd = "node "+module+" --ackmate -G \"*"+path.extname(document.fileName)+"\" -d \"*node_modules*\" \""+pattern+"\" "+path.join(document.fileName,"../");

        console.log(cmd);

        return search_1.definitionSearch(document, word).then(function(location){
            console.log(location);
            return new vscode.Location(vscode.Uri.file(location.fname),new vscode.Position(parseInt(location.line_num),0));
            //return new vscode.Location(vscode.Uri.file(path.join(working_dir,"spec.md")),new vscode.Position(parseInt(location.line_num),0));
        });
        //return null;
    };
    return PeekFileDefinitionProvider;
}());
//# sourceMappingURL=extension.js.map