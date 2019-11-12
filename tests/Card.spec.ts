import {expect} from 'chai';
import 'mocha';

import {Card, NoSingle, PairType} from '../src/components/Card';
import {Suit} from "../src/Suit";

const allSuits: Suit[] = [
    Suit.BRAIN,
    Suit.COG,
    Suit.LEAF,
    Suit.MATH
];

const identityFunction = function() {};

describe('valid in pairs', () => {

    it('should return true by default', () => {
        let card = new Card({value: 1, suit: Suit.LEAF, inPair: PairType.NULL, pairSelect: identityFunction})

        expect(card.validInPair([])).to.equal(true);
    })

    for (let firstSuit of allSuits) {
        it('should return true when both cards have "' + firstSuit, () => {
            let card = new Card({value: 1, suit: firstSuit, inPair: PairType.NULL, pairSelect: identityFunction});
            let secondCard = new Card({value: 1, suit: firstSuit, inPair: PairType.NULL, pairSelect: identityFunction});

            expect(card.validInPair([secondCard])).to.equal(true);
        })

        for (let secondSuit of allSuits) {
            if (secondSuit == firstSuit) {
                continue;
            } else {
                it('should return false when first card has "' + firstSuit + '" and second card has "' + secondSuit + '"', () => {
                    let card = new Card({
                        value: 1,
                        suit: firstSuit,
                        inPair: PairType.NULL,
                        pairSelect: identityFunction
                    });
                    let secondCard = new Card({
                        value: 1,
                        suit: secondSuit,
                        inPair: PairType.NULL,
                        pairSelect:
                        identityFunction
                    });

                    expect(card.validInPair([secondCard])).to.equal(false);
                })
            }
        }
    }
});

describe('No single', function () {
    it('should return false when the card is on its own', () => {
        let card = new NoSingle({value: 1, suit: Suit.BRAIN, inPair: PairType.NULL, pairSelect: identityFunction});

        expect(card.validInPair([])).to.equal(false);
    })

    it('should return true when the card has a friend', () => {
        let card = new NoSingle({value: 1, suit: Suit.BRAIN, inPair: PairType.NULL, pairSelect: identityFunction});
        let secondCard = new NoSingle({value: 1, suit: Suit.BRAIN, inPair: PairType.NULL, pairSelect: identityFunction});

        expect(card.validInPair([secondCard])).to.equal(true);
    })

});
