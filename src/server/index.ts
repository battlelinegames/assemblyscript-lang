import {
  IPCMessageReader,
  IPCMessageWriter,
  createConnection,
  IConnection,
  TextDocuments,
  InitializeResult,
  TextDocumentSyncKind,
  CodeActionKind,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

const SERVER_NAME = "AssemblyScript Language Server";
process.title = SERVER_NAME;

// Create a connection for the server. The connection uses Node's IPC as a transport
const connection: IConnection = createConnection(
  new IPCMessageReader(process),
  new IPCMessageWriter(process)
);

const documents = new TextDocuments(TextDocument);

connection.onInitialize((): InitializeResult => {
  return {
    capabilities: {
      documentFormattingProvider: false,
      documentRangeFormattingProvider: false,
      textDocumentSync: {
        openClose: true,
        change: TextDocumentSyncKind.Full,
      },
      documentHighlightProvider: false,
      hoverProvider: false,
      referencesProvider: false,
      definitionProvider: false,
    },
  };
});

documents.listen(connection);
connection.listen();
