import { Component } from "./component.js";
import { Node } from "./node.js";
import { mainEditor } from "../circuitEditor.js";


export class SevenSegmentDisplay extends Component{
    constructor(x, y, color, highlightColor) {
        super(x, y, color, highlightColor);
        this.x = x;
        this.y = y;
        this.color = color;
        this.highlightColor = highlightColor;

        this.component.setAttrs({
            id: "7SL"
        })

        this.input = [];
        this.segment = [];

        this.layer = mainEditor.findOne("#componentLayer");
    }


    setupNodes() {

        this.input[0] = new Node(-20, 20, false, false, this.color); // a
        this.component.add(this.input[0].draw());
        this.input[1] = new Node(-20, 40, false, false, this.color); // b
        this.component.add(this.input[1].draw());
        this.input[2] = new Node(-20, 60, false, false, this.color); // c
        this.component.add(this.input[2].draw());
        this.input[3] = new Node(-20, 80, false, false, this.color); // d
        this.component.add(this.input[3].draw());

        this.input[4] = new Node(40, 120, false, false, this.color); // e
        this.component.add(this.input[4].draw());
        this.input[5] = new Node(60, 120, false, false, this.color); // f
        this.component.add(this.input[5].draw());
        this.input[6] = new Node(80, 120, false, false, this.color); // g
        this.component.add(this.input[6].draw());


        this.segment[0] = new LedSegment(40, 25, 60, 25); // a
        this.component.add(this.segment[0].draw());
        this.segment[1] = new LedSegment(60, 25, 60, 48); // b
        this.component.add(this.segment[1].draw());
        this.segment[2] = new LedSegment(60, 49, 60, 72); // c
        this.component.add(this.segment[2].draw());
        this.segment[3] = new LedSegment(40, 71, 60, 71); // d
        this.component.add(this.segment[3].draw());

        this.segment[4] = new LedSegment(40, 49, 40, 72); // e
        this.component.add(this.segment[4].draw());
        this.segment[5] = new LedSegment(40, 25, 40, 48); // f
        this.component.add(this.segment[5].draw());
        this.segment[6] = new LedSegment(40, 48, 60, 48); // g
        this.component.add(this.segment[6].draw());
    }


    render() {

        const digitalNumber = new Konva.Text({
            x: 30,
            y: 25,
            text: "8",
            fontSize: 50,
            fill: "red",
            fontFamily: "Digital Numbers Regular",
            opacity: 0.2,
        })

        const sevenSegmentDisplay = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: function(context, shape) {
                context.beginPath();
                context.rect(0,0,100,100);
 
                for(let i = 20; i < 100; i +=20) {

                    context.moveTo(0,i)
                    context.lineTo(-20,i);
                }

                for(let i = 40; i < 100; i +=20) {

                    context.moveTo(i, 100)
                    context.lineTo(i, 120);
                }
                
                context.fillStrokeShape(shape);

            },

            stroke: this.color,
            strokeWidth: this.strokeWidth,

        })

        this.component.add(sevenSegmentDisplay, digitalNumber);

        this.setupNodes();
        
        this.layer.add(this.component);

        

    }

    draw() {

        for(let i = 0; i < this.input.length; i++) {
            
            if(this.input[i].getValue()) {
                this.segment[i].segment.setAttrs({
                    stroke: "red",
                    //zIndex: 0,
                    opacity: 1
                })
            } else {
                this.segment[i].segment.setAttrs({
                    opacity: 0
                })
            }
        }
    }
}



class LedSegment {
    constructor(x1, y1, x2, y2) {
        
        this.segment = new Konva.Line({
            points: [x1, y1, x2, y2],
            stroke: "red",
            strokeWidth: 4,
            opacity: 0
        })
    }


    draw() {
        return this.segment;
    }
}