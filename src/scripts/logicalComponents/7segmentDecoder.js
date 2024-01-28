import { Component } from "./component.js";
import { Node } from "./node.js";

export class SevenSegmentDecoder extends Component{
    constructor(x, y, color, rotation) {
        
        super(x, y, color, rotation);

        this.id = "SSD";
        this.editType = "noEdit";


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

        this.nodes[0] = new Node(80, 20, true, true, this.color); // a
        this.nodes[0].createPin(60, 20, 80, 20, this.component, "a", 45, 25);

        this.nodes[1] = new Node(80, 40, true, true, this.color); // b
        this.nodes[1].createPin(60, 40, 80, 40, this.component, "b", 45, 45);

        this.nodes[2] = new Node(80, 60, true, true, this.color); // c
        this.nodes[2].createPin(60, 60, 80, 60, this.component, "c", 45, 65);

        this.nodes[3] = new Node(80, 80, true, true, this.color); // d
        this.nodes[3].createPin(60, 80, 80, 80, this.component, "d", 45, 85);

        this.nodes[4] = new Node(80, 100, true, true, this.color); // e
        this.nodes[4].createPin(60, 100, 80, 100, this.component, "e", 45, 105);

        this.nodes[5] = new Node(80, 120, true, true, this.color); // f
        this.nodes[5].createPin(60, 120, 80, 120, this.component, "f", 45, 125);

        this.nodes[6] = new Node(80, 140, true, false, this.color); // g
        this.nodes[6].createPin(60, 140, 80, 140, this.component, "g", 45, 145);

        this.nodes[10] = new Node(-20, 20, false, false, this.color); // I3
        this.nodes[10].createPin(0, 20, -20, 20, this.component, "I3", 5, 25);

        this.nodes[9] = new Node(-20, 40, false, false, this.color); // I2
        this.nodes[9].createPin(0, 40, -20, 40, this.component, "I2", 5, 45);

        this.nodes[8] = new Node(-20, 60, false, false, this.color); // I1
        this.nodes[8].createPin(0, 60, -20, 60, this.component, "I1", 5, 65);

        this.nodes[7] = new Node(-20, 80, false, false, this.color); // I0
        this.nodes[7].createPin(0, 80, -20, 80, this.component, "I0", 5, 85);

        this.startNodeId = this.nodes[0].id;
    }

    render() {

        const sevenSegmentDecoder = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();
                context.rect(0,0,60,160);
                context.closePath();
                context.fillStrokeShape(shape);

            },

            stroke: this.color,
            strokeWidth: this.strokeWidth,
        })
        
        this.setupNodes();
        this.component.add(sevenSegmentDecoder);

        this.layer.add(this.component);
    }


    execute() {

        let input = 0;
        if(this.nodes[7].getValue()) input += 1;
        if(this.nodes[8].getValue()) input += 2;
        if(this.nodes[9].getValue()) input += 4;
        if(this.nodes[10].getValue()) input += 8;

        for(let i = 0; i < 7; i++) {
            this.nodes[i].setValue(this.symbols[input][i]);
        }
    }


}