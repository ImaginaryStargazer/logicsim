import { Component } from "./component.js";
import { Node } from "./node.js";
import { mainEditor } from "../circuitEditor.js";


export class SevenSegmentDecoder extends Component{
    constructor(x, y, color, highlightColor) {
        
        super(x, y, color, highlightColor);

        this.x = x;
        this.y = y;
        this.color = color;
        this.highlightColor = highlightColor;

        this.component.setAttrs({
            id: "7SD",
        })

        this.layer = mainEditor.findOne("#componentLayer");

        this.input = [];
        this.output = [];

        this.symbols = [
            // a     b     c     d     e     f     g
            [true, true, true, true, true, true, false], // 0
            [false, true, true, false, false, false, false], // 1
            [true, true, false, true, true, false, true], // 2
            [true, true, true, true, false, false, true], // 3
            [false, true, true, false, false, true, true], // 4
            [true, false, true, true, false, true, true], // 5
            [true, false, true, true, true, true, true], // 6
            [true, true, true, false, false, false, false], // 7
            [true, true, true, true, true, true, true], // 8
            [true, true, true, true, false, true, true], // 9
            [true, true, true, false, true, true, true], // a
            [false, false, true, true, true, true, true], // b
            [true, false, false, true, true, true, false], // c
            [false, true, true, true, true, false, true], // d
            [true, false, false, true, true, true, true], // e
            [true, false, false, false, true, true, true], // f
        ]
    }

    setupNodes() {

        this.input[3] = new Node(-20,20, false, false, this.color); // I3
        this.component.add(this.input[3].draw());
        this.input[2] = new Node(-20,40, false, false, this.color); // I2
        this.component.add(this.input[2].draw());
        this.input[1] = new Node(-20,60, false, false, this.color); // I1
        this.component.add(this.input[1].draw());
        this.input[0] = new Node(-20,80, false, false, this.color); // I0
        this.component.add(this.input[0].draw());

        this.output[0] = new Node(80, 20, true, true, this.color); // a
        this.component.add(this.output[0].draw());
        this.output[1] = new Node(80, 40, true, true, this.color); // b
        this.component.add(this.output[1].draw());
        this.output[2] = new Node(80, 60, true, true, this.color); // c
        this.component.add(this.output[2].draw());
        this.output[3] = new Node(80, 80, true, true, this.color); // d
        this.component.add(this.output[3].draw());
        this.output[4] = new Node(80, 100, true, true, this.color); // e
        this.component.add(this.output[4].draw());
        this.output[5] = new Node(80, 120, true, true, this.color); // f
        this.component.add(this.output[5].draw());
        this.output[6] = new Node(80, 140, true, false, this.color); // g
        this.component.add(this.output[6].draw());
    }

    render() {

        const sevenSegmentDecoder = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: function(context, shape) {
                context.beginPath();
                context.rect(0,0,60,160);
 
                for(let i = 20; i < 100; i +=20) {

                    context.moveTo(0,i)
                    context.lineTo(-20,i);
                }

                for(let i = 20; i < 160; i +=20) {

                    context.moveTo(60,i)
                    context.lineTo(80,i);
                }
                
                context.fillStrokeShape(shape);

            },

            stroke: this.color,
            strokeWidth: this.strokeWidth,
        })
        

        this.component.add(sevenSegmentDecoder);

        this.setupNodes();

        this.layer.add(this.component);
    }


    draw() {

        let input = 0;
        if(this.input[0].getValue()) input += 1;
        if(this.input[1].getValue()) input += 2;
        if(this.input[2].getValue()) input += 4;
        if(this.input[3].getValue()) input += 8;

        for(let i = 0; i < this.output.length; i++) {
            this.output[i].setValue(this.symbols[input][i]);
        }
    }
}