import { Node } from "./node.js";
import { Component } from "./component.js";


export class BinarySwitch extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "BSW";

        this.lastClock = false;
    }


    setupNodes() {

        this.nodes[0] = new Node(80, 20, true, false, this.color, "T");
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(80, 40, true, false, this.color, "F");
        this.component.add(this.nodes[1].draw());

        this.nodes[2] = new Node(-20, 20, false, false, this.color, "I0");
        this.component.add(this.nodes[2].draw());

        this.startNodeId = this.nodes[0].id;
        
    }

    render() {

        const binarySwitch = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();
                context.rect(0, 0, 60, 60);
                
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0;
                for(let i = 20; i <= 40; i+=20) {
                    context.moveTo(60, i);
                    context.lineTo(80, i);

                    context.fillText(this.nodes[ii].label, 45, i + 5);

                    ii++;
                }

                context.moveTo(0, 20);
                context.lineTo(-20, 20);

                context.fillText(this.nodes[ii].label, 5, 25);

                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.component.add(binarySwitch);
        this.setupNodes();
        this.layer.add(this.component);

    }


    draw() {

        if(this.lastClock) {

            this.nodes[0].value = true;
            this.nodes[1].value = false;
            
        } else {
            this.nodes[0].value = false;
            this.nodes[1].value = true;
        }

        this.lastClock = this.nodes[2].value;

    }


}