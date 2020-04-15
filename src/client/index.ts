// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from "path";
import { workspace, ExtensionContext } from "vscode";
import * as vscode from "vscode";
import {
  ServerOptions,
  TransportKind,
  LanguageClient,
  LanguageClientOptions,
} from "vscode-languageclient";
// import * as langtypes from "vscode-languageserver-types";

vscode.window.showInformationMessage("Extension context entered!");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel(
    "AssemblyScript Language Server"
  );

  // The server is implemented in another project and outputted there
  let serverModule = context.asAbsolutePath(
    path.join("lib", "server", "index.js")
  );

  // The debug options for the server
  // TODO: Figure out what this means
  let debugOptions = { execArgv: ["--nolazy", "--debug=6009"] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the  normal ones are used
  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Options of the language client
  let clientOptions: LanguageClientOptions = {
    // Activate the server for DOT files
    documentSelector: ["asc"],
    synchronize: {
      // Synchronize the section 'assemblyScriptLanguageServer' of the settings to the server
      configurationSection: "assemblyScriptLanguageServer",
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: [
        workspace.createFileSystemWatcher("assembly/**/*.asc"),
        workspace.createFileSystemWatcher("assembly/**/*.ts"),
        workspace.createFileSystemWatcher("package.json"),
      ],
    },
    outputChannelName: "AssemblyScript Language Server",
  };

  outputChannel.appendLine("Client Intiated!");
  outputChannel.show(true);

  // Create the language client and start the client.
  let disposable = new LanguageClient(
    "assemblyScriptLanguageServer",
    "Language Server",
    serverOptions,
    clientOptions
  ).start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(disposable, outputChannel);
}

// this method is called when your extension is deactivated
export function deactivate() {}
