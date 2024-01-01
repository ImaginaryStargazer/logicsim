import { Component } from "./component.js";
import { Node } from "./node.js";


export class Multiplexor extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "MUX";
        this.editType = "chipEdit";
        this.bits = 2;
    }

    setEditInfo() {

        let inputValue = document.getElementById("bitEdit").value;

        if (!this.validateInputFields(inputValue) || inputValue == "") return;

        this.destroy();
        this.bits = inputValue;
        this.render();

        console.log(this)
    }


    setupNodes() {

        let shift = 20;

        for(let i = 0; i < 2**this.bits; i++) {
            this.nodes[i] = new Node(-20, shift, false, false, this.color);
            this.nodes[i].createPin(0, shift, -20, shift, this.component, "I" + i, 10, shift + 5);

            shift += 20;
        }

        shift = 20;

        this.nodes[2**this.bits + this.bits] = new Node(this.bits * 40 + 20, 20, true, false, this.color);
        this.nodes[2**this.bits + this.bits].createPin(this.bits * 40, shift, this.bits * 40 + 20, shift, this.component, "Q", this.bits * 40 - 15, 25);

        for(let i = 0; i < this.bits; i++) {
            this.nodes[2**this.bits + i] = new Node(shift, 2**this.bits * 20 + 60, false, false, this.color);
            this.nodes[2**this.bits + i].createPin(shift, 2**this.bits * 20 + 40, shift, 2**this.bits * 20 + 60, this.component, "S" + i, shift - 10, 2**this.bits * 20 + 40 - 10);

            shift += 20;
        }


        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const multiplexor = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();
                context.rect(0, 0, this.bits * 40, 2**this.bits * 20 + 40);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth

        })

        this.setupNodes();
        this.component.add(multiplexor);

        this.layer.add(this.component);

    }


    draw() {
        
        let selectedValue = 0;

        for(let i = 0; i != this.bits; i++) {

            if(this.nodes[2**this.bits+i].value) {

                selectedValue |= 1<<i;
            }

        }

        this.nodes[2**this.bits + this.bits].setValue(this.nodes[selectedValue].value)

    }

}