const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')
const { runInNewContext } = require('node:vm')
const ts = require('typescript')

// Load the production modules without requiring a native device or wallet provider.
function loadModule(relativePath, { env = {}, mocks = {} } = {}) {
  const filename = path.join(__dirname, '..', relativePath)
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  })
  const module = { exports: {} }
  runInNewContext(outputText, {
    module,
    exports: module.exports,
    URL,
    process: { env },
    console,
    require(name) {
      assert.ok(Object.hasOwn(mocks, name), `Unexpected dependency: ${name}`)
      return mocks[name]
    },
  }, { filename })
  return module.exports
}

for (const scheme of ['phantomwallet', 'customapp']) {
  for (const initial of [false, true]) {
    test(`${scheme}: callbacks route home (initial=${initial})`, () => {
      const { redirectSystemPath } = loadModule('app/+native-intent.tsx', {
        env: { EXPO_PUBLIC_APP_SCHEME: scheme },
      })
      for (const pathname of [
        `${scheme}://phantom-auth-callback?code=test&state=test`,
        '/phantom-auth-callback?code=test&state=test',
      ]) {
        assert.equal(redirectSystemPath({ path: pathname, initial }), '/')
      }
    })
  }
}

test('default scheme works without an environment override', () => {
  const { redirectSystemPath } = loadModule('app/+native-intent.tsx')
  assert.equal(redirectSystemPath({ path: 'phantomwallet://phantom-auth-callback', initial: true }), '/')
})

test('unrelated and malformed links pass through unchanged', () => {
  const { redirectSystemPath } = loadModule('app/+native-intent.tsx')
  for (const pathname of [
    '/wallet',
    '/other?code=test',
    'phantomwallet://wallet',
    'otherapp://phantom-auth-callback',
    'https://example.com/phantom-auth-callback',
    'http://[',
  ]) {
    assert.equal(redirectSystemPath({ path: pathname, initial: false }), pathname)
  }
})

function loadConnectButton() {
  const state = { isConnected: false, isConnecting: false }
  function Redirect() {}
  const { ConnectButton } = loadModule('components/ConnectButton.tsx', {
    mocks: {
      react: { createElement: (type, props, ...children) => ({ type, props: { ...props, children } }) },
      'react-native': {
        View: 'View', TouchableOpacity: 'TouchableOpacity', Text: 'Text',
        ActivityIndicator: 'ActivityIndicator', StyleSheet: { create: (styles) => styles },
        Alert: { alert: () => assert.fail('Rendering must not show an alert') },
      },
      '@phantom/react-native-sdk': {
        useConnect: () => ({ connect: async () => {}, isConnecting: state.isConnecting }),
        useAccounts: () => ({ isConnected: state.isConnected }),
      },
      'expo-router': { Redirect },
      '@/lib/theme': { colors: {} },
    },
  })
  return { ConnectButton, Redirect, state }
}

test('a restored connected session redirects to the dashboard', () => {
  const { ConnectButton, Redirect, state } = loadConnectButton()
  state.isConnected = true
  const rendered = ConnectButton()
  assert.equal(rendered.type, Redirect)
  assert.equal(rendered.props.href, '/wallet')
})

test('a disconnected session offers both providers without redirecting', () => {
  const { ConnectButton } = loadConnectButton()
  const rendered = ConnectButton()
  assert.equal(rendered.type, 'View')
  assert.equal(rendered.props.children.length, 2)
  for (const button of rendered.props.children) {
    assert.equal(button.type, 'TouchableOpacity')
    assert.equal(button.props.disabled, false)
  }
})

test('connecting stays on the welcome screen until the session is connected', () => {
  const { ConnectButton, Redirect, state } = loadConnectButton()
  state.isConnecting = true
  let rendered = ConnectButton()
  assert.equal(rendered.type, 'View')
  for (const button of rendered.props.children) assert.equal(button.props.disabled, true)
  state.isConnecting = false
  state.isConnected = true
  rendered = ConnectButton()
  assert.equal(rendered.type, Redirect)
  assert.equal(rendered.props.href, '/wallet')
})
