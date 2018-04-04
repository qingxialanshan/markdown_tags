//import { ViewColumn } from 'vscode';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "gotodef" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let goToDef = vscode.commands.registerCommand('extension.goToDef', function (editor) {
        // The code you place here will be executed every time your command is executed
        //var document = editor.document;
        // Display a message box to the user
        //vscode.window.showInformationMessage("Go to definition start");
       
        return vscode.workspace.openTextDocument(vscode.Uri.file(editor.fsPath+"/../spec.md")).then(function(doc){
            return vscode.window.showTextDocument(doc);
        })
    });

    context.subscriptions.push(goToDef);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;