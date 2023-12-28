import { Component } from "./component.js";
import { Node } from "./node.js";

export class SevenSegmentDisplay extends Component{
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "SSL";
        this.editType = "colorEdit";
        this.ledColor = "red";

        this.segment = [];
    }


    setEditInfo() {

        const inputValue = document.getElementById("colorEditValue").value;

        this.ledColor = inputValue;

    }


    setupNodes() {
        

        this.nodes[0] = new Node(-20, 20, false, false, this.color, "a"); // a
        this.nodes[0].createPin(0, 20, -20, 20, this.component, "a", 5, 25);

        this.nodes[1] = new Node(-20, 40, false, false, this.color); // b
        this.nodes[1].createPin(0, 40, -20, 40, this.component, "b", 5, 45);

        this.nodes[2] = new Node(-20, 60, false, false, this.color); // c
        this.nodes[2].createPin(0, 60, -20, 60, this.component, "c", 5, 65);

        this.nodes[3] = new Node(-20, 80, false, false, this.color); // d
        this.nodes[3].createPin(0, 80, -20, 80, this.component, "d", 5, 85);

        this.nodes[4] = new Node(40, 120, false, false, this.color); // e
        this.nodes[4].createPin(40, 100, 40, 120, this.component, "e", 35, 95);

        this.nodes[5] = new Node(60, 120, false, false, this.color); // f
        this.nodes[5].createPin(60, 100, 60, 120, this.component, "f", 55, 95);

        this.nodes[6] = new Node(80, 120, false, false, this.color); // g
        this.nodes[6].createPin(80, 100, 80, 120, this.component, "g", 75, 95);


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
            fill: this.ledColor,
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
                    stroke: this.ledColor,
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