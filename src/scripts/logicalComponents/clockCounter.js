import { Node } from "./node.js";
import { Component } from "./component.js";

export class ClockCounter extends Component{
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "CLC";


        this.lastClock = false;
        this.clockCount = 4;
        this.currentClockCount = 0;
    }

    setupNodes() {


        this.nodes[0] = new Node(-20, 20, false, false, this.color, "CLK");
        this.nodes[1] = new Node(-20, 40, false, false, this.color, "R");
        this.nodes[2] = new Node(-20, 60, false, false, this.color, "CE");

        this.nodes[3] = new Node(80, 40, true, false, this.color, "Q");

        for(let i = 0; i < this.nodes.length; i++) {
            this.component.add(this.nodes[i].draw());
        }


        this.startNodeId = this.nodes[0].id;

    }


    render() {

        const clockCounter = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();
                context.rect(0, 0, 60, 80);
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0;
                for(let i = 20; i <= 60; i+=20) {
                    context.moveTo(0, i);
                    context.lineTo(-20, i);


                    context.fillText(this.nodes[ii].label, 5, i + 5);

                    ii++;
                }

                context.moveTo(60, 40);
                context.lineTo(80, 40);
                context.fillText(this.nodes[ii].label, 45,  45);

                context.closePath();

                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.component.add(clockCounter);
        this.setupNodes();
        this.layer.add(this.component);
    }


    draw() {

        let running = true;

        if(this.nodes[2].value) {
            running = false;
        }

        if(this.nodes[1].value) {
            this.currentClockCount = 0;
        }

        if(this.nodes[0].value && !this.lastClock && running) {

            this.currentClockCount++;

            if(this.currentClockCount == this.clockCount) {

                this.nodes[3].value = true;
                this.currentClockCount = 0;
                
            } else {
                this.nodes[3].value = false;
            }
        
        }


        this.lastClock = this.nodes[0].value

    }

}