export const GILL_EXTERNAL_MODULE_MAP = {
  solanaAccounts: 'gill',
  solanaAddresses: 'gill',
  solanaCodecsCore: 'gill',
  solanaCodecsDataStructures: 'gill',
  solanaCodecsNumbers: 'gill',
  solanaCodecsStrings: 'gill',
  solanaErrors: 'gill',
  solanaInstructions: 'gill',
  solanaOptions: 'gill',
  solanaPrograms: 'gill',
  solanaRpcTypes: 'gill',
  solanaSigners: 'gill',
}

export function createCodamaConfig({ clientJs, dependencyMap = GILL_EXTERNAL_MODULE_MAP, idl }) {
  return {
    idl,
    scripts: {
      js: {
        from: '@codama/renderers-js',
        args: [clientJs, { dependencyMap }],
      },
    },
  }
}

export default createCodamaConfig({
  clientJs: 'anchor/src/client/js',
  idl: 'anchor/target/idl/counter.json',
})
