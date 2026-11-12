// The one model this chat uses, under its two names. The attestation is requested for Nito's catalog ID, which ends in
// :encrypted. Inside the enclave the model has its native name: it goes in the encrypted request and in the header Nito
// routes by, and the enclave refuses a request where the two differ.
export const NITO_MODEL = 'openai/gpt-oss-120b:encrypted'
export const ENCLAVE_MODEL = 'gpt-oss-120b'
