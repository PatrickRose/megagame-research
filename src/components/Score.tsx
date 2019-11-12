import * as React from "react";
import {Suit as SuitEnum} from "../Suit";
import {Suit} from "./Suit";

export type Scores = {
    basic?: SuitEnum,
    bonus?: SuitEnum
};

export interface ScoreProps {
    brain: number,
    cogs: number,
    leaf: number,
    math: number
};

export class
Score extends React.Component<ScoreProps, {}> {
    render(): React.ReactNode {
        return <ul>
            <li>{this.props.brain} <Suit value={SuitEnum.BRAIN} /></li>
            <li>{this.props.cogs} <Suit value={SuitEnum.COG} /></li>
            <li>{this.props.leaf} <Suit value={SuitEnum.LEAF} /></li>
            <li>{this.props.math} <Suit value={SuitEnum.MATH} /></li>
        </ul>;
    }
}
