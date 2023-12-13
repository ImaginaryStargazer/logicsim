import { Node } from "./node.js";
import { Component } from "./component.js";


export class Counter extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "CTR";


        this.lastClock = undefined;

    }


    setupNodes() {

        this.nodes[0] = new Node(-20, 20, false, false, this.color, "CLK");
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(-20, 80, false, false, this.color, "R");
        this.component.add(this.nodes[1].draw());

        this.nodes[2] = new Node(80, 20, true, false, this.color, "Q3");
        this.component.add(this.nodes[2].draw());
        this.nodes[3] = new Node(80, 40, true, false, this.color, "Q2");
        this.component.add(this.nodes[3].draw());
        this.nodes[4] = new Node(80, 60, true, false, this.color, "Q1");
        this.component.add(this.nodes[4].draw());
        this.nodes[5] = new Node(80, 80, true, false, this.color, "Q0");
        this.component.add(this.nodes[5].draw());

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const counter = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();
                context.rect(0, 0, 60, 100);
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0;
                for(let i = 20; i <= 80; i+=60) {
                    context.moveTo(0, i);
                    context.lineTo(-20, i);


                    context.fillText(this.nodes[ii].label, 5, i + 5);

                    ii++;
                }

                for(let i = 20; i < 100; i+=20) {

                    context.moveTo(60, i);
                    context.lineTo(80, i);


                    context.fillText(this.nodes[ii].label, 35, i + 5);

                    ii++;
                }

                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth,
        })


        this.component.add(counter);
        this.setupNodes();
        this.layer.add(this.component);
    }


    draw() {

        let i;
        let value = 0;

        if (this.nodes[1].value) {
            for (i = 0; i != 4; i++)
                this.nodes[i+2].value = false;
        }

        if(this.nodes[0].value && !this.lastClock) {

            let dir = 1;
            
            let lastBit = 2+4-1;
            for (i = 0; i != 4; i++)
                if (this.nodes[lastBit-i].value)
                value |= 1<<i;

            value += dir;


            for (i = 0; i != 4; i++) {
                this.nodes[lastBit-i].value = (value & (1<<i)) != 0;
            }

        }


        this.lastClock = this.nodes[0].value;
    }


}