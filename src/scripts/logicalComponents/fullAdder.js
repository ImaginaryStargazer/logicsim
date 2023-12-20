import { Node } from "./node.js";
import { Component } from "./component.js";


export class FullAdder extends Component {

    constructor(x, y, color, rotation) {

        super(x, y, color, rotation);

        this.id = "FAD";
        this.editType = "noEdit";
    }

    setupNodes() {

        this.nodes[0] = new Node(-20, 20, false, false, this.color, "A");
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(-20, 40, false, false, this.color, "B");
        this.component.add(this.nodes[1].draw());
        this.nodes[2] = new Node(-20, 60, false, false, this.color, "Cin");
        this.component.add(this.nodes[2].draw());
        this.nodes[3] = new Node(80, 20, true, false, this.color, "S");
        this.component.add(this.nodes[3].draw());
        this.nodes[4] = new Node(80, 60, true, false, this.color, "C");
        this.component.add(this.nodes[4].draw());

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const fullAdder = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.fillStyle = this.color;
                context.font = "bold 13px Arial";
                context.beginPath();

                context.rect(0, 0, 60, 80);

                let shift = 20;
                let ii = 3;

                for(let i = 0; i < 3; i++)  {
                    context.moveTo(0, shift);
                    context.lineTo(-20, shift);


                    if(i != 1) {
                        context.moveTo(60, shift);
                        context.lineTo(80, shift); 
                        context.fillText(this.nodes[ii].label, 45, shift + 5);
                        ii++;
                    }


                    context.fillText(this.nodes[i].label, 5, shift + 5);

                    shift += 20;
                }


                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.component.add(fullAdder);
        this.setupNodes();
        this.layer.add(this.component);

    }

    draw() {

        // S = A ⊕ B ⊕ Cin
        // C = A.B + B.Cin + A.Cin

        this.nodes[3].setValue(this.nodes[0].value  ^ this.nodes[1].value ^ this.nodes[2].value); // S
        this.nodes[4].setValue(this.nodes[0].value & this.nodes[1].value | this.nodes[1].value & this.nodes[2].value | this.nodes[0].value & this.nodes[2].value); // C

    }
}