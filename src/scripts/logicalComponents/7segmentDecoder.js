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

        this.nodes[0] = new Node(80, 20, true, true, this.color, "a"); // a
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(80, 40, true, true, this.color, "b"); // b
        this.component.add(this.nodes[1].draw());
        this.nodes[2] = new Node(80, 60, true, true, this.color, "c"); // c
        this.component.add(this.nodes[2].draw());
        this.nodes[3] = new Node(80, 80, true, true, this.color, "d"); // d
        this.component.add(this.nodes[3].draw());
        this.nodes[4] = new Node(80, 100, true, true, this.color, "e"); // e
        this.component.add(this.nodes[4].draw());
        this.nodes[5] = new Node(80, 120, true, true, this.color, "f"); // f
        this.component.add(this.nodes[5].draw());
        this.nodes[6] = new Node(80, 140, true, false, this.color, "g"); // g
        this.component.add(this.nodes[6].draw());

        this.nodes[10] = new Node(-20,20, false, false, this.color, "I0"); // I0
        this.component.add(this.nodes[10].draw());
        this.nodes[9] = new Node(-20,40, false, false, this.color, "I1"); // I1
        this.component.add(this.nodes[9].draw());
        this.nodes[8] = new Node(-20,60, false, false, this.color, "I2"); // I2
        this.component.add(this.nodes[8].draw());
        this.nodes[7] = new Node(-20,80, false, false, this.color, "I3"); // I3
        this.component.add(this.nodes[7].draw());

        this.startNodeId = this.nodes[0].id;

        console.log(this.startNodeId)
    }

    render() {

        const sevenSegmentDecoder = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();
                context.rect(0,0,60,160);
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";
 
                let ii = 0;

                for(let i = 20; i < 160; i +=20) {

                    context.moveTo(60,i)
                    context.lineTo(80,i);


                    context.fillText(this.nodes[ii].label, 45, 5 + i)

                    ii++;
                }

                for(let i = 20; i < 100; i +=20) {

                    context.moveTo(0,i)
                    context.lineTo(-20,i);

                    context.fillText(this.nodes[ii].label, 5, 5 + i)

                    ii++;
                }


                context.closePath();
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
        if(this.nodes[7].getValue()) input += 1;
        if(this.nodes[8].getValue()) input += 2;
        if(this.nodes[9].getValue()) input += 4;
        if(this.nodes[10].getValue()) input += 8;

        for(let i = 0; i < 7; i++) {
            this.nodes[i].setValue(this.symbols[input][i]);
        }
    }


}