// Here we export some useful types and functions for interacting with the Anchor program.
import HelloWorldIDL from '../target/idl/hello_world.json'

// Re-export the generated IDL and type
export { HelloWorldIDL }

export * from './client/js'
