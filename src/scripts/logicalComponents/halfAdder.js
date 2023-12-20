import { Node } from "./node.js";
import { Component } from "./component.js";


export class HalfAdder extends Component {
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation);


        this.id = "HAD";
        this.editType = "noEdit";
    }

    setupNodes() {

        this.nodes[0] = new Node(-20, 20, false, false, this.color, "A");
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(-20, 60, false, false, this.color, "B");
        this.component.add(this.nodes[1].draw());
        this.nodes[2] = new Node(80, 20, true, false, this.color, "S");
        this.component.add(this.nodes[2].draw());
        this.nodes[3] = new Node(80, 60, true, false, this.color, "C");
        this.component.add(this.nodes[3].draw());

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const halfAdder = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();

                context.rect(0, 0, 60, 80);
                
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0;
                for(let i = 20; i <= 60; i+=40) {

                    context.moveTo(0, i);
                    context.lineTo(-20, i);


                    context.fillText(this.nodes[ii].label, 10, i + 5);

                    ii++;

                }

                for(let i = 20; i <= 60; i+=40) {

                    context.moveTo(60, i);
                    context.lineTo(80, i);

                    context.fillText(this.nodes[ii].label, 40, i + 5);

                    ii++;
                }

                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.component.add(halfAdder);
        this.setupNodes();
        this.layer.add(this.component);

    }


    draw() {

        // S = A ⊕ B
        // C = A.B

        this.nodes[2].setValue(this.nodes[0].value ^ this.nodes[1].value); // S
        this.nodes[3].setValue(this.nodes[0].value & this.nodes[1].value); // C
    }

}