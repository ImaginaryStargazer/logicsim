import { mainEditor } from "../circuitEditor.js";
import { Component } from "./component.js";
import { Node } from "./node.js";

export class ClockGen extends Component{
    constructor(x, y, color, highlightColor) {
        super(x, y, color, highlightColor);
        this.x = x;
        this.y = y;
        this.color = color;
        this.value = false;
        this.highlightColor = highlightColor;

        this.component.setAttrs({
            id: "CLK"
        })

        this.truePeriod = 2000 * 50 / 100;
        this.falsePeriod = 2000 * (100 - 50) / 100;
        this.lastTick = new Date().getTime();


        this.layer = mainEditor.findOne("#componentLayer");

        this.output = new Node(100, 20, true, this.value, this.color);

    }


    render() {

        const body = new Konva.Rect({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            stroke: this.color,
            strokeWidth: 2
        })
        
        
        const symbol = new Konva.Line({
            points: [5, 25, 15, 25, 15, 10, 25, 10, 25, 25, 35, 25],
            stroke: this.color,
            strokeWidth: 2,
        })

        const output = new Konva.Line({
            points: [40, 20, 100, 20],
            stroke: this.color,
            strokeWidth: 2,
        })


        this.component.add(body, symbol, output, this.output.draw());

        this.layer.add(this.component)
    }

    draw() {
        const currTick = new Date().getTime();

        const period = (this.value) ? this.truePeriod : this.falsePeriod;
        if (currTick - this.lastTick > period) {
            this.toggle();
            this.lastTick = currTick;
        }

        this.output.setValue(this.value);
    }
}