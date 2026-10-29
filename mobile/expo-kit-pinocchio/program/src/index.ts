// Here we export some useful types and functions for interacting with the program.
import HelloWorldIDL from '../target/idl/hello_world.json'

// Re-export the generated Codama IDL
export { HelloWorldIDL }

export * from './client/js'
