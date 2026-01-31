import { Codama, updateInstructionsVisitor } from 'codama';

/**
 * Removes the internal emitEvent instruction from client APIs.
 */
export function removeEmitInstruction(pinocchioCounterCodama: Codama): Codama {
    pinocchioCounterCodama.update(
        updateInstructionsVisitor({
            emitEvent: {
                delete: true,
            },
        }),
    );
    return pinocchioCounterCodama;
}
