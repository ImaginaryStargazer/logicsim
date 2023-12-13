import { Node } from "./node.js";
import { Component } from "./component.js";


export class Latch extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "LTC";

        this.lastLoad = false; // LD node
        this.bits = 4;
    }


    setupNodes() {

        this.nodes[0] = new Node(-20, 20, false, false, this.color, "I3");
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(-20, 40, false, false, this.color, "I2");
        this.component.add(this.nodes[1].draw());
        this.nodes[2] = new Node(-20, 60, false, false, this.color, "I1");
        this.component.add(this.nodes[2].draw());
        this.nodes[3] = new Node(-20, 80, false, false, this.color, "I0");
        this.component.add(this.nodes[3].draw());
        this.nodes[4] = new Node(-20, 100, false, false, this.color, "LD");
        this.component.add(this.nodes[4].draw());
        this.nodes[5] = new Node(80, 20, true, false, this.color, "O");
        this.component.add(this.nodes[5].draw());
        this.nodes[6] = new Node(80, 40, true, false, this.color, "O");
        this.component.add(this.nodes[6].draw());
        this.nodes[7] = new Node(80, 60, true, false, this.color, "O");
        this.component.add(this.nodes[7].draw());
        this.nodes[8] = new Node(80, 80, true, false, this.color, "O");
        this.component.add(this.nodes[8].draw());

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const Latch = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();
                context.rect(0,0, 60, 120);
                
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0;

                for(let i = 20; i < 120; i +=20) {

                    context.moveTo(0,i)
                    context.lineTo(-20,i);
                    context.fillText(this.nodes[ii].label, 5, 5 + i)

                    ii++;
                }

                for(let i = 20; i < 100; i +=20) {

                    context.moveTo(60,i)
                    context.lineTo(80,i);

                    context.fillText(this.nodes[ii].label, 45, 5 + i)

                    ii++;
                }

                context.closePath();


                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.component.add(Latch);
        this.setupNodes();
        this.layer.add(this.component);

    }


    draw() {
        
        if (this.nodes[4].getValue() && !this.lastLoad)
            for (let i = 0; i != this.bits; i++)
            this.nodes[i+this.bits+1].value = this.nodes[i].value;

        this.lastLoad = this.nodes[4].getValue();
    }


}
