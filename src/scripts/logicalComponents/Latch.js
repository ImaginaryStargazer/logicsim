import { Node } from "./node.js";
import { Component } from "./component.js";


export class Latch extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "LTC";
        this.editType = "chipEdit";

        this.lastLoad = false; // LD node
        this.bits = 4;
    }


    setEditInfo() {

        let inputValue = document.getElementById("bitEdit").value;

        if (!this.validateInputFields(inputValue) || inputValue == "") return;

        this.destroy();
        this.bits = inputValue;
        this.render();
    }

    setupNodes() {

        let shift = 20;

        for(let i = 0; i < this.bits; i++) {
            this.nodes[i] = new Node(-20, shift, false, false, this.color);
            this.nodes[i].createPin(0, shift, -20, shift, this.component, "I" + (this.bits - i - 1), 5, shift + 5);

            shift += 20;
        }

        this.nodes[this.bits] = new Node(-20, shift, false, false, this.color);
        this.nodes[this.bits].createPin(0, shift, -20, shift, this.component, "LD", 5, shift + 5);

        shift = 20;

        for(let i = 0; i < this.bits; i++) {
            this.nodes[i + this.bits + 1] = new Node(80, shift, true, false, this.color);
            this.nodes[i + this.bits + 1].createPin(60, shift, 80, shift, this.component, "O", 45, shift + 5);

            shift += 20;
        }


        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const Latch = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();
                context.rect(0,0, 60, this.bits * 20 + 40);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })
        
        this.setupNodes();
        this.component.add(Latch);
        this.layer.add(this.component);

    }


    draw() {
        
        if (this.nodes[this.bits].getValue() && !this.lastLoad)
            for (let i = 0; i != this.bits; i++)
            this.nodes[i+this.bits+1].value = this.nodes[i].value;

        this.lastLoad = this.nodes[this.bits].getValue();
    }


}
