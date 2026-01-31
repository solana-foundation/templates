import { Codama, updateInstructionsVisitor, accountBumpValueNode } from 'codama';

/**
 * Sets default bump values for createCounter instruction.
 */
export function updateInstructionBumps(pinocchioCounterCodama: Codama): Codama {
    pinocchioCounterCodama.update(
        updateInstructionsVisitor({
            createCounter: {
                arguments: {
                    bump: {
                        defaultValue: accountBumpValueNode('counter'),
                    },
                },
            },
        }),
    );
    return pinocchioCounterCodama;
}
