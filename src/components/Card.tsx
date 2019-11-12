import {Suit} from "../Suit";
import {Suit as SuitComponent} from "./Suit";
import * as React from "react";

export type PairSelect = (selectedPair: PairType) => void;

export enum CardType {
    BASE,
    NO_SINGLE
}

export interface CardDef {
    value: number,
    suit: Suit,
    inPair: PairType,
    type: CardType,
}

export interface CardProps {
    value: number,
    suit: Suit,
    inPair: PairType,
    pairSelect: PairSelect
}

export enum PairType {
    LEFT,
    RIGHT,
    NULL
}

export class Card extends React.Component<CardProps> {

    public getSuit(): Suit {
        return this.props.suit;
    }

    public validInPair(otherItemsInPair: Card[]): boolean {
        for (let card of otherItemsInPair) {
            if (card.getSuit() != this.getSuit()) {
                return false;
            }
        }

        return this.validationMethod(otherItemsInPair);
    }

    public render() {return (<div className={"card-wrapper"}>
            <div className={"card"}>
                <div className={"card-body"}>
                    <div className={"card-title"}><span className={"card-value"}>{this.props.value}</span><SuitComponent value={this.props.suit}/></div>
                    <div className={"card-text"}>{this.getExtraText()}</div>
                </div>
                <div className={"card-footer"}>
                    {this.renderButtons()}
                </div>
            </div>
        </div>);
    }

    protected validationMethod(otherItemsInPair: Card[]): boolean {
        return true;
    }

    protected getExtraText(): string {
        return ''
    }

    private renderButtons(): React.ReactNode {
        return <div className={"btn-group"}>
            <button className={"btn btn-secondary" + (this.props.inPair == PairType.LEFT ? ' active' : '')}
                    disabled={this.props.inPair == PairType.LEFT }
                    onClick={() => { this.props.pairSelect(PairType.LEFT) }}>
                Left
            </button>
            <button className={"btn btn-secondary" + (this.props.inPair == PairType.NULL ? ' active' : '')}
                    disabled={this.props.inPair == PairType.NULL }
                    onClick={() => { this.props.pairSelect(PairType.NULL) }}>
                No pair
            </button>
            <button className={"btn btn-secondary" + (this.props.inPair == PairType.RIGHT ? ' active' : '')}
                    disabled={this.props.inPair == PairType.RIGHT }
                    onClick={() => { this.props.pairSelect(PairType.RIGHT) }}>
                Right
            </button>
        </div>
    }

    static createFromDef(cardDef: CardDef, selectFunction: PairSelect = () => {}): Card {
        let cardProps: CardProps = {
            ...cardDef,
            pairSelect: selectFunction
        }

        switch (cardDef.type) {
            case CardType.NO_SINGLE:
                return new NoSingle(cardProps);
            case CardType.BASE:
                return new Card(cardProps);
            default:
                throw new Error("Unknown cardtype " + cardDef.type);
        }
    }
}

export class NoSingle extends Card {
    protected validationMethod(otherItemsInPair: Card[]): boolean {
        return otherItemsInPair.length > 0;
    }

    protected getExtraText(): string {
        return 'No single';
    }
}


