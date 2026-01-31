import {
    Codama,
    pdaValueNode,
    pdaSeedValueNode,
    accountValueNode,
    publicKeyValueNode,
    pdaLinkNode,
    setInstructionAccountDefaultValuesVisitor,
} from 'codama';

const PINOCCHIO_COUNTER_PROGRAM_ID = 'PinocchioTemp1ate11111111111111111111111111';
const SYSTEM_PROGRAM_ID = '11111111111111111111111111111111';

/**
 * Sets default values for common instruction accounts (program IDs, PDAs).
 */
export function setInstructionAccountDefaultValues(pinocchioCounterCodama: Codama): Codama {
    pinocchioCounterCodama.update(
        setInstructionAccountDefaultValuesVisitor([
            // Global Constants
            {
                account: 'pinocchioCounterProgram',
                defaultValue: publicKeyValueNode(PINOCCHIO_COUNTER_PROGRAM_ID),
            },
            {
                account: 'systemProgram',
                defaultValue: publicKeyValueNode(SYSTEM_PROGRAM_ID),
            },

            // PDA Derivations
            {
                account: 'counter',
                defaultValue: pdaValueNode(pdaLinkNode('counter'), [
                    pdaSeedValueNode('authority', accountValueNode('authority')),
                ]),
            },
            {
                account: 'eventAuthority',
                defaultValue: pdaValueNode(pdaLinkNode('eventAuthority'), []),
            },
        ]),
    );
    return pinocchioCounterCodama;
}
