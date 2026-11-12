export default {
  idl: 'target/idl/hello_world.json',
  scripts: {
    js: {
      from: '@codama/renderers-js',
      args: [
        'program/src/client/js',
        { generatedFolder: 'generated', kitImportStrategy: 'rootOnly', syncPackageJson: false },
      ],
    },
  },
}
