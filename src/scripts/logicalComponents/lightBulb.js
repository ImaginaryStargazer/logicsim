import { Component } from "./component.js";
import { Node } from "./node.js";
import { mainEditor } from "../circuitEditor.js";


export class LightBulb extends Component {

    constructor(x, y, color,highlightColor) {
        super(x, y, color, highlightColor)

        this.color = color;

        this.component.setAttr("id", "Bulb")
        
        this.layer = mainEditor.findOne("#componentLayer");

        this.input = new Node(-80, 0, false, false, this.color);

    }


    render() {

        const body = new Konva.Circle({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            stroke: this.color,
            strokeWidth: 2,
        })

        let shift = 0;

        for(let i = 0; i < 2; i++) {
            const symbol = new Konva.Line({
                points: [0, -20, 0, 20],
                stroke: this.color,
                strokeWidth: 2,
                rotation: shift += 45
            })

            shift += 45;

            this.component.add(symbol);
        }


        const output = new Konva.Line({
            points: [-20, 0, -80, 0],
            stroke: this.color,
            strokeWidth: 2,

        })


        this.component.add(body, output, this.input.draw());

        this.layer.add(this.component);
    }

    draw() {
        if(this.input.getValue()) {
            this.component.findOne("Circle").fill("yellow")
        } else {
            this.component.findOne("Circle").fill("")
        }
    }


}