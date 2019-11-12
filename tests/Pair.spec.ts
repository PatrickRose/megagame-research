import {expect} from 'chai';
import 'mocha';

import {Card, CardDef, CardType, PairType} from '../src/components/Card';
import {Suit} from "../src/Suit";
import {Pair} from "../src/components/Pair";

const identityFunction = () => {
};
const allSuits: Suit[] = [
    Suit.BRAIN,
    Suit.COG,
    Suit.LEAF,
    Suit.MATH
];

describe('valid in pairs', () => {

    it('returns invalid if the set is empty', () => {
        expect(Pair.validateSet([])).to.equal(false);
    });

    it('returns invalid if the set contains 1 NoSingle', () => {
        let card: CardDef = {
            value: 1,
            suit: Suit.LEAF,
            inPair: PairType.NULL,
            type: CardType.NO_SINGLE
        };

        expect(Pair.validateSet([card])).to.equal(false);
    })

    it('return valid if the set contains 2 NoSingle', () => {
        const props: CardDef[] = [
            {
                value: 1,
                suit: Suit.LEAF,
                inPair: PairType.NULL,
                type: CardType.NO_SINGLE
            },
            {
                value: 1,
                suit: Suit.LEAF,
                inPair: PairType.NULL,
                type: CardType.NO_SINGLE
            }
        ];

        expect(Pair.validateSet(props)).to.equal(true);
    })
    for (let firstSuit of allSuits) {
        it('should return true when both cards have "' + firstSuit, () => {
            let firstCard: CardDef = {value: 1, suit: firstSuit, inPair: PairType.NULL, type: CardType.BASE};
            let secondCard: CardDef = {value: 1, suit: firstSuit, inPair: PairType.NULL, type: CardType.BASE};

            expect(Pair.validateSet([firstCard, secondCard])).to.equal(true);
        })

        for (let secondSuit of allSuits) {
            if (secondSuit == firstSuit) {
                continue;
            }

            it('should return false when first card has "' + firstSuit + '" and second card has "' + secondSuit + '"', () => {
                let firstCard: CardDef = {
                    value: 1,
                    suit: firstSuit,
                    inPair: PairType.NULL,
                    type: CardType.BASE
                };
                let secondCard: CardDef = {
                    value: 1,
                    suit: secondSuit,
                    inPair: PairType.NULL,
                    type: CardType.BASE
                }

                expect(Pair.validateSet([firstCard, secondCard])).to.equal(false);
            })
        }
    }

});

describe('value of pair', () => {
    it ('should return 0 when empty', () => {
        expect(Pair.valueOfPair([])).to.equal(0);
    })
})
