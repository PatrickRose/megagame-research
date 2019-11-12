import {Suit as SuitEnum} from "../Suit";
import * as React from "react";

export interface SuitProps {
    value: SuitEnum
};

export class Suit extends React.Component<SuitProps, {}> {
    render(): React.ReactNode {
        let icon: string;

        switch (this.props.value) {
            case SuitEnum.LEAF:
                icon = 'fa-leaf';
                break;
            case SuitEnum.BRAIN:
                icon = 'fa-brain';
                break;
            case SuitEnum.COG:
                icon = 'fa-cog';
                break;
            case SuitEnum.MATH:
                icon = 'fa-square-root-alt';
                break;
        }

        return <span className={"fas " + icon}>
            {this.props.value}
        </span>
    }
}
