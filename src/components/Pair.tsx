import * as React from "react";
import {Card, CardDef} from "./Card";
import {Suit} from "./Suit";
import {Scores} from "./Score";
import {Suit as SuitEnum, ALL_SUITS} from "../Suit";

export interface PairDef {
    left: CardDef[],
    right: CardDef[],
    scores?: Scores
}

export interface PairProps {
    leftPair: CardDef[],
    rightPair: CardDef[],
}

export interface PairSideProps {
    cards: CardDef[]
}

export class PairSide extends React.Component<PairSideProps, {}> {
    render() {
        let cardToText = (value: CardDef, key: number) => {
            return <span key={key}>
                { value.value }
                <Suit value={value.suit} />
            </span>
        };

        return (
            <span>
                { this.props.cards.map(cardToText) }
            </span>
        );
    }
}

export class Pair extends React.Component<PairProps, {}> {

    render(): React.ReactNode {
        return <tr>
            <td>
                <PairSide cards={this.props.leftPair}/>
            </td>
            <td>
                <PairSide cards={this.props.rightPair}/>
            </td>
        </tr>;
    }

    public static validateSet(set: CardDef[]): boolean {
        if (set.length == 0) {
            return false;
        }

        for (let cardDef of set) {
            let card = Card.createFromDef(cardDef);
            let newSet: Card[] = [];

            for (let nextCardDef of set) {
                if (nextCardDef != cardDef) {
                    newSet.push(Card.createFromDef(nextCardDef));
                }
            }

            if (!card.validInPair(newSet)) {
                return false;
            }
        }

        return true;
    }

    public static valueOfPair(set: CardDef[]): number {
        const mapFn = (card: CardDef) => {
            return card.value;
        }

        const reduceFn = (total: number, currentValue: number) => {
            return total + currentValue;
        }

        return set.map(mapFn).reduce(reduceFn, 0)
    }
}

interface ScoredPairProps extends PairProps {
    score: Scores,
    selectScore: (scoreType: keyof Scores, scoreAs: SuitEnum) => void
}

export class ScoredPair extends React.Component<ScoredPairProps, {}> {
    render (): React.ReactNode {
        return <tr>
            <td>
                <PairSide cards={this.props.leftPair}/>
            </td>
            <td>
                <PairSide cards={this.props.rightPair}/>
            </td>
            <td>
                { this.renderBonuses() }
            </td>
            <td>
                { this.renderButtons() }
            </td>
        </tr>
    }

    private renderBonuses(): React.ReactNode {
        return <span>
            { this.isBalancedPair() ? 'Balanced Pair' : 'No bonus' }
        </span>;
    }

    private isBalancedPair(): boolean {
        return this.props.leftPair.length == this.props.rightPair.length;
    }

    private renderButtons(): React.ReactNode {
        let basic = this.makeButtons('basic', this.props.score ? this.props.score.basic : null);

        let bonus: React.ReactNode = this.isBalancedPair() ? this.makeButtons('bonus', this.props.score ? this.props.score.bonus : null) : null;

        return <div>
            { basic }
            { bonus }
        </div>
    }

    private makeButtons(scoreType: keyof Scores, selected: SuitEnum): React.ReactNode {
        let suits: SuitEnum[] = [
            this.props.leftPair[0].suit,
        ];

        if (suits[0] != this.props.rightPair[0].suit) {
            suits.push(this.props.rightPair[0].suit);
        }
        
        return <div>
            { "Score " + scoreType + " as:" }
            <div className={"btn-group"}>
            { suits.map(
                (value: SuitEnum, key: number) => {
                    return <button
                    className={"btn btn-secondary " + (value == selected ? 'active' : '')}
                        onClick={() => {
                            this.props.selectScore(scoreType, value)
                        }}
                    >
                        <Suit value={value} />
                    </button>
                }
            ) }
        </div>
            </div>;
    }
}
