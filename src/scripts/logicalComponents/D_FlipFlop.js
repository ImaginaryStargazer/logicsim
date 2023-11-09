import { mainEditor } from "../circuitEditor.js";
import { Component } from "./component.js";
import { Node } from "./node.js";

export class D_FlipFlop extends Component {
    constructor(x, y, color, highlightColor) {
        super(x, y, color, highlightColor)

        this.x = x;
        this.y = y;
        this.color = color;
        this.highlightColor = highlightColor;

        this.component.setAttrs({
            id: "DFF",
        })

        this.input = [];
        this.output = [];
        this.lastClock = undefined;

        this.layer = mainEditor.findOne("#componentLayer");

    }

    setupNodes() {

        this.input[0] = new Node(-20, 20, false, false, this.color)
        this.component.add(this.input[0].draw());
        this.input[1] = new Node(-20, 60, false, false, this.color)
        this.component.add(this.input[1].draw());

        this.output[0] = new Node(80, 20, true, false, this.color);
        this.component.add(this.output[0].draw());
        this.output[1] = new Node(80, 60, true, true, this.color);
        this.component.add(this.output[1].draw());

    }


    render() {

        const D_FlipFlop = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: function(context, shape) {
                
                context.beginPath();
                context.rect(0, 0, 60, 80)

                for(let i = 20; i < 100; i += 40) {

                    context.moveTo(0, i);
                    context.lineTo(-20, i);
                }


                for(let i = 20; i < 100; i += 40) {

                    context.moveTo(60, i);
                    context.lineTo(80, i);
                }

                context.fillStrokeShape(shape);
            }

        })


        this.component.add(D_FlipFlop);
        this.setupNodes();

        this.layer.add(this.component);

    }

    draw() {

        if(this.input[1].getValue() && !this.lastClock) {
            this.output[0].setValue(this.input[0].getValue())
        }


        this.output[1].setValue(!this.output[0].getValue());
	    this.lastClock = this.input[1].getValue();
    }
}