import * as React from "react";
import {Card, CardDef, CardType, NoSingle, PairType} from "./Card";
import {Suit} from "../Suit";
import {Pair, PairDef, ScoredPair} from "./Pair";
import {Score, ScoreProps, Scores} from "./Score";

export interface BoardState {
    deck: CardDef[],
    hand: CardDef[],
    discards: CardDef[],
    pairs: PairDef[],
    leftPair: CardDef[],
    rightPair: CardDef[]
}

class SuitDef {
    constructor(
        private readonly suit: Suit,
        private readonly noSingle: Number[],
        private readonly allowSingle: Number[]
    ) {
    }

    public makeCards(): CardDef[] {
        return [].concat(
            this.noSingle.map(
                (value: number): CardDef => {
                    return {
                        value: value,
                        suit: this.suit,
                        inPair: PairType.NULL,
                        type: CardType.NO_SINGLE
                    }
                }
            ),
            this.allowSingle.map(
                (value: number): CardDef => {
                    return {
                        value: value,
                        suit: this.suit,
                        inPair: PairType.NULL,
                        type: CardType.BASE
                    }
                }
            )
        );
    }
}

type HandProps = {
    value: CardDef[],
    selectCard: (selectedPair: PairType, positionInHand: number) => void
};

class Hand extends React.Component<HandProps, {}> {
    render(): React.ReactNode {
        return <div className={"hand"}>
            {this.props.value.map(
                (cardDef: CardDef, index: number): React.ReactNode => {
                    switch (cardDef.type) {
                        case CardType.BASE:
                            return <Card value={cardDef.value}
                                         suit={cardDef.suit}
                                         inPair={cardDef.inPair}
                                         pairSelect={(selectedPair: PairType) => {
                                             this.props.selectCard(selectedPair, index);
                                         }}
                                         key={index}
                            />;
                        case CardType.NO_SINGLE:
                            return <NoSingle value={cardDef.value}
                                             suit={cardDef.suit}
                                             inPair={cardDef.inPair}
                                             pairSelect={(selectedPair: PairType) => {
                                                 this.props.selectCard(selectedPair, index);
                                             }}
                                             key={index}
                            />;
                        default:
                            throw new Error("Unknown card type")
                    }
                }
            )}
        </div>;
    }
}

const STARTING_HAND_SIZE = 6;

export class Board extends React.Component<{}, BoardState> {
    constructor(props: {}) {
        super(props);

        let state: BoardState = this.getStartingState();

        this.state = state;
    }

    private getStartingState(deck: CardDef[] = Board.BasicDeck()): BoardState {
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        let hand: CardDef[] = deck.slice(0, STARTING_HAND_SIZE);

        return {
            deck: deck.slice(STARTING_HAND_SIZE),
            hand: hand,
            pairs: [],
            discards: [],
            leftPair: [],
            rightPair: []
        }
    }

    private discardHand() {
        this.drawCards(
            this.state.hand.length + 1,
            true
        );
    }

    render(): React.ReactNode {
        if (this.state.hand.length > 0) {
            return this.inProgressRender();
        } else {
            return this.gameOverRender();
        }
    }

    private inProgressRender() {
        return <div>
            <h2>Cards left in deck: {this.state.deck.length}</h2>
            <Hand value={this.state.hand}
                  selectCard={
                      (selectedPair: PairType, positionInHand: number) => {
                          return this.selectCard(selectedPair, positionInHand);
                      }
                  }
            />
            <div className={"btn-group"}>
                {this.renderDiscardButton()}
                {this.renderMakePairButton()}
            </div>
            {this.renderPairs()}
        </div>;
    }

    private static BasicDeck(): CardDef[] {
        const brains: SuitDef = new SuitDef(
            Suit.BRAIN,
            [1, 1, 2, 2, 3],
            [3, 3, 4, 5, 6, 10]
        );
        const cog: SuitDef = new SuitDef(
            Suit.COG,
            [1, 1, 2],
            [1, 2, 3, 4, 4, 5, 7]
        );
        const leaf: SuitDef = new SuitDef(
            Suit.LEAF,
            [1, 2, 3, 4],
            [2, 5, 6]
        );
        const math: SuitDef = new SuitDef(
            Suit.MATH,
            [1, 2],
            [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 6, 8]
        );

        return [].concat(
            math.makeCards(),
            leaf.makeCards(),
            cog.makeCards(),
            brains.makeCards()
        );
    }

    private drawCards(cardsToDraw: number, discardFirst: boolean = false) {
        let deck = this.state.deck.slice(),
            hand = this.state.hand.slice(),
            discards = this.state.discards.slice();

        if (discardFirst) {
            discards.push(...hand);
            hand = [];
        }

        if (deck.length < cardsToDraw) {
            hand.push(...deck);
            deck = [];
        } else {
            for (let i = 0; i < cardsToDraw; i++) {
                hand.push(deck.pop());
            }
        }

        this.setState({
            deck: deck,
            hand: hand,
            discards: discards
        });
    }

    private renderDiscardButton(): React.ReactNode {
        return <button className={"btn btn-secondary"} onClick={() => {
            this.discardHand()
        }}>
            {this.state.deck.length == 0 ? "Discard hand and end game" : "Discard hand"}
        </button>;
    }

    private renderMakePairButton(): React.ReactNode {
        const leftPairs = this.generatePair(PairType.LEFT),
            rightPairs = this.generatePair(PairType.RIGHT);

        const rightValue = Pair.valueOfPair(rightPairs),
            leftValue = Pair.valueOfPair(leftPairs);

        let message: string;

        switch (true) {
            case leftPairs.length == 0:
                message = 'No cards selected for left side of pair';
                break;
            case rightPairs.length == 0:
                message = 'No cards selected for right side of pair';
                break;
            case !Pair.validateSet(leftPairs):
                message = 'Left side of pair is invalid';
                break;
            case !Pair.validateSet(rightPairs):
                message = 'Right side of pair is invalid';
                break;
            case rightValue != leftValue:
                message = 'Pair values don\'t match (left: ' + leftValue + ', right: ' + rightValue + ')';
                break
            default:
                message = 'Make pair'
        }

        return <button onClick={() => {
            this.makePair()
        }}
                       disabled={message != 'Make pair'}
                       className={"btn btn-primary"}>
            {message}
        </button>;
    }

    private generatePair(searchFor: PairType.RIGHT | PairType.LEFT): CardDef[] {
        return this.state.hand.filter(
            (value: CardDef) => {
                return value.inPair == searchFor;
            }
        )
    }

    private selectCard(selectedPair: PairType, positionInHand: number) {
        let hand = this.state.hand.slice();

        hand[positionInHand].inPair = selectedPair;

        this.setState({hand: hand});
    }

    private makePair() {
        const leftPairs = this.generatePair(PairType.LEFT),
            rightPairs = this.generatePair(PairType.RIGHT);

        let pairDefs = this.state.pairs.slice();

        let newPairDef: PairDef = {
            left: leftPairs,
            right: rightPairs
        }

        if (leftPairs[0].suit == rightPairs[0].suit) {
            newPairDef.scores = {
                basic: rightPairs[0].suit
            };

            if (leftPairs.length == rightPairs.length) {
                newPairDef.scores.bonus = rightPairs[0].suit;
            }
        }
        
        pairDefs.push(newPairDef);

        let hand = this.state.hand.slice().filter(
            (value: CardDef) => {
                return value.inPair == PairType.NULL
            }
        );

        this.setState(
            {
                hand: hand,
                pairs: pairDefs,
            },
            () => {
                this.drawCards(2)
            }
        )
    }

    private renderPairs(): React.ReactNode {
        return <table className={"table"}>
            <thead>
            <tr>
                <th>Left Side</th>
                <th>Right Side</th>
            </tr>
            </thead>
            <tbody>
            {this.state.pairs.map(
                (value: PairDef, key: number) => {
                    return <Pair leftPair={value.left} rightPair={value.right} key={key}/>
                }
            )}
            </tbody>
        </table>
    }

    private restart(): void {
        this.setState(this.getStartingState());
    }

    private gameOverRender(): React.ReactNode {
        return <div>
            <h2>Game over!</h2>
            <button className="btn btn-primary" onClick={() => {this.restart(); }}>Play again?</button>
            {this.renderScore()}
            <table className={"table"}>
                <thead>
                <tr>
                    <td>
                        Left Pair
                    </td>
                    <td>
                        Right Pair
                    </td>
                    <td>
                        Bonuses
                    </td>
                    <td>
                        Select side
                    </td>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.pairs.map(
                        (value, key: number) => {
                            return <ScoredPair
                                leftPair={value.left}
                                rightPair={value.right}
                                score={value.scores}
                                selectScore={
                                    (scoreType: keyof Scores, scoreAs: Suit) => {
                                        this.scorePair(key, scoreType, scoreAs);
                                    }
                                }
                                key={key}/>
                        }
                    )
                }
                </tbody>
            </table>
        </div>
    }

    public scorePair(key: number, scoreType: keyof Scores, scoreAs: Suit): void {
        let pairs = this.state.pairs.slice();

        let score = pairs[key].scores || {};

        score[scoreType] = scoreAs;

        pairs[key].scores = score;

        this.setState({
            pairs: pairs
        });
    }

    private renderScore() {
        let scores: ScoreProps = {
            brain: 0,
            cogs: 0,
            leaf: 0,
            math: 0
        }

        for (let pair of this.state.pairs) {
            if (!pair.scores) {
                continue;
            }

            switch (pair.scores.basic) {
                case Suit.BRAIN:
                    scores.brain++;
                    break;
                case Suit.COG:
                    scores.cogs++;
                    break;
                case Suit.MATH:
                    scores.math++;
                    break;
                case Suit.LEAF:
                    scores.leaf++;
                    break;
            }
            switch (pair.scores.bonus) {
                case Suit.BRAIN:
                    scores.brain++;
                    break;
                case Suit.COG:
                    scores.cogs++;
                    break;
                case Suit.MATH:
                    scores.math++;
                    break;
                case Suit.LEAF:
                    scores.leaf++;
                    break;
            }
        }

        return <Score {...scores} />
    }
}
