import { Node } from "./node.js";
import { Component } from "./component.js";


export class Counter extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "CTR";
        this.editType = "chipEdit";
        this.bits = 4;

        this.lastClock = undefined;

    }

    setEditInfo() {

        let inputValue = document.getElementById("bitEdit").value;

        if (!this.validateInputFields(inputValue) || inputValue == "") return;

        this.destroy();
        this.bits = Number(inputValue);
        this.render();
    }


    setupNodes() {

        let shift = 20;

        this.nodes[0] = new Node(-20, 20, false, false, this.color);
        this.nodes[0].createPin(0, shift, -20, shift, this.component, "CLK", 5, 25);


        for(let i = 0; i < this.bits; i++) {
            
            this.nodes[i + 2] = new Node(80, shift, true, false, this.color);
            this.nodes[i + 2].createPin(60, shift, 80, shift, this.component, "Q" + (this.bits - i - 1), 35, shift + 5);

            shift += 20;

        }

        
        this.nodes[1] = new Node(-20, shift - 20, false, false, this.color);
        this.nodes[1].createPin(0, shift - 20, -20, shift - 20, this.component, "R", 5, shift - 15);

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const counter = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();
                context.rect(0, 0, 60, this.bits * 20 + 20);
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth,
        })

        this.setupNodes();
        this.component.add(counter);
        this.layer.add(this.component);
    }


    draw() {

        let i;
        let value = 0;

        if (this.nodes[1].value) {
            for (i = 0; i != this.bits; i++)
                this.nodes[i+2].value = false;
        }

        if(this.nodes[0].value && !this.lastClock) {

            let dir = 1;
            
            let lastBit = 2+this.bits-1;

            for (i = 0; i != this.bits; i++)
                if (this.nodes[lastBit-i].value)
                value |= 1<<i;

            value += dir;


            for (i = 0; i != this.bits; i++)
                this.nodes[lastBit-i].value = (value & (1<<i)) != 0;
            

        }


        this.lastClock = this.nodes[0].value;
    }


}
