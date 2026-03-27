/**
 * Server-side mock for @monaco-editor/react
 *
 * Payload CMS calls useEditorConfig() during SSR. When Monaco has no context
 * provider (server environment), the real hook returns undefined, causing
 * "Cannot destructure property 'config' of undefined".
 *
 * This mock returns safe defaults so Payload's CodeEditor renders without
 * crashing on the server. Monaco itself only loads client-side.
 */

const defaultConfig = {
  config: {},
  options: {},
  overrideServices: {},
  defaultModelOptions: {},
}

module.exports = {
  default: function MonacoEditorMock() { return null },
  Editor: function EditorMock() { return null },
  DiffEditor: function DiffEditorMock() { return null },
  useMonaco: function useMonaco() { return null },
  useEditorConfig: function useEditorConfig() { return defaultConfig },
  loader: {
    config: function() {},
    init: function() { return Promise.resolve() },
  },
}
