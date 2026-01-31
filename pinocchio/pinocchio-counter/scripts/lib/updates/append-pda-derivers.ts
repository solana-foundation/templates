import {
    Codama,
    constantPdaSeedNode,
    stringTypeNode,
    stringValueNode,
    variablePdaSeedNode,
    publicKeyTypeNode,
    addPdasVisitor,
} from 'codama';

/**
 * Adds PDA derivation functions for counter accounts.
 */
export function appendPdaDerivers(pinocchioCounterCodama: Codama): Codama {
    pinocchioCounterCodama.update(
        addPdasVisitor({
            pinocchioCounter: [
                {
                    name: 'counter',
                    seeds: [
                        constantPdaSeedNode(stringTypeNode('utf8'), stringValueNode('counter')),
                        variablePdaSeedNode('authority', publicKeyTypeNode()),
                    ],
                },
                {
                    name: 'eventAuthority',
                    seeds: [constantPdaSeedNode(stringTypeNode('utf8'), stringValueNode('event_authority'))],
                },
            ],
        }),
    );
    return pinocchioCounterCodama;
}
