import { Codama, createFromJson } from 'codama';
import {
    appendAccountDiscriminator,
    appendPdaDerivers,
    setInstructionAccountDefaultValues,
    updateInstructionBumps,
} from './updates';
import { removeEmitInstruction } from './updates/remove-emit-instruction';

/**
 * Builder for applying Codama IDL transformations before client generation.
 */
export class PinocchioCounterCodamaBuilder {
    private codama: Codama;

    constructor(pinocchioCounterIdl: unknown) {
        const idlJson =
            typeof pinocchioCounterIdl === 'string' ? pinocchioCounterIdl : JSON.stringify(pinocchioCounterIdl);
        this.codama = createFromJson(idlJson);
    }

    appendAccountDiscriminator(): this {
        this.codama = appendAccountDiscriminator(this.codama);
        return this;
    }

    appendPdaDerivers(): this {
        this.codama = appendPdaDerivers(this.codama);
        return this;
    }

    setInstructionAccountDefaultValues(): this {
        this.codama = setInstructionAccountDefaultValues(this.codama);
        return this;
    }

    updateInstructionBumps(): this {
        this.codama = updateInstructionBumps(this.codama);
        return this;
    }

    removeEmitInstruction(): this {
        this.codama = removeEmitInstruction(this.codama);
        return this;
    }

    build(): Codama {
        return this.codama;
    }
}

export function createPinocchioCounterCodamaBuilder(pinocchioCounterIdl: unknown): PinocchioCounterCodamaBuilder {
    return new PinocchioCounterCodamaBuilder(pinocchioCounterIdl);
}
