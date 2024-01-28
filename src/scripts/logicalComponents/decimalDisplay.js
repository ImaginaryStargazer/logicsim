import { Node } from "./node.js";
import { Component } from "./component.js";



export class DecimalDisplay extends Component{
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation);

        this.id = "DLD";
        this.editType = "decimalDisplayEdit";
        this.ledColor = "red";
        this.bits = 4;
    }

    setEditInfo() {

        let inputValue = Number(document.getElementById("decBitEdit").value);
        let colorValue = document.getElementById("numberColor").value;

        this.ledColor = colorValue;
        this.number.fill(this.ledColor);
    

        if (!this.validateInputFields(inputValue) || inputValue == "") return;

        if(inputValue !== this.bits) {
            this.destroy();
            this.bits = inputValue;
            this.render();
        }


    }



    setupNodes() {

        let shift = 20;

        for(let i = 0; i < this.bits; i++) {
            this.nodes[i] = new Node(-20, shift, false, false, this.color);
            this.nodes[i].createPin(0, shift, -20, shift, this.component, "I" + (this.bits - i - 1), 4, shift + 5);

            shift +=20;
        }


        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const decimalDisplay = new Konva.Shape({
            x: 0, 
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();

                if(this.bits == 1)
                    context.rect(0,0,(this.bits * 40),this.bits * 20 + 20)
                else
                    context.rect(0,0,(this.bits * 20 + 20),this.bits * 20 + 20);
                
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })


        this.number = new Konva.Text({
            text: "0",
            x: (this.bits * 20) / 2,
            y: (this.bits * 20) / 2,
            fontSize: 32,
            fill: this.ledColor,
            fontFamily: "Arial",
            strokeEnabled: false
        })

        this.setupNodes();
        this.component.add(decimalDisplay, this.number);
        this.layer.add(this.component);
    }


    execute() {
        let input = 0;

        for (let i = 0; i != this.bits; i++)
            if (this.nodes[this.bits - i - 1].value)
        	    input |= 1<<i;


        this.number.text(input);
    }

}