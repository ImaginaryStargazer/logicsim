import { Component } from "./component.js";
import { Node } from "./node.js";

export class SevenSegmentDisplay extends Component{
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "SSL";

        this.segment = [];
    }


    setupNodes() {
        

        this.nodes[0] = new Node(-20, 20, false, false, this.color, "a"); // a
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(-20, 40, false, false, this.color, "b"); // b
        this.component.add(this.nodes[1].draw());
        this.nodes[2] = new Node(-20, 60, false, false, this.color, "c"); // c
        this.component.add(this.nodes[2].draw());
        this.nodes[3] = new Node(-20, 80, false, false, this.color, "d"); // d
        this.component.add(this.nodes[3].draw());

        this.nodes[4] = new Node(40, 120, false, false, this.color, "e"); // e
        this.component.add(this.nodes[4].draw());
        this.nodes[5] = new Node(60, 120, false, false, this.color, "f"); // f
        this.component.add(this.nodes[5].draw());
        this.nodes[6] = new Node(80, 120, false, false, this.color, "g"); // g
        this.component.add(this.nodes[6].draw());


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

        this.startNodeId = this.nodes[0].id;
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
            strokeEnabled: false
        })

        const sevenSegmentDisplay = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();
                context.rect(0, 0, 100, 100);

                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0;
                for (let i = 20; i < 100; i += 20) {

                    context.moveTo(0, i);
                    context.lineTo(-20, i);
                    context.fillText(this.nodes[ii].label, 3, 5 + i);

                    ii++;
                }

                for (let i = 40; i < 100; i += 20) {

                    context.moveTo(i, 100);
                    context.lineTo(i, 120);

                    context.fillText(this.nodes[ii].label, -4 + i, 95);

                    ii++;
                }

                context.closePath();
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

        for(let i = 0; i < this.nodes.length; i++) {
            
            if(this.nodes[i].getValue()) {
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