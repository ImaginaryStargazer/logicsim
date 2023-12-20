import { Node } from "./node.js";
import { Component } from "./component.js";



export class DecimalDisplay extends Component{
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation);

        this.id = "DLD";
        this.editType = "colorEdit";

        this.number = new Konva.Text({
            text: "0",
            x: 28,
            y: 35,
            fontSize: 35,
            fill: "red",
            fontFamily: "Arial",
            strokeEnabled: false
        })
    }


    setupNodes() {

        this.nodes[3] = new Node(-20, 20, false, false, this.color, "I0");
        this.component.add(this.nodes[3].draw());
        this.nodes[2] = new Node(-20, 40, false, false, this.color, "I1");
        this.component.add(this.nodes[2].draw());
        this.nodes[1] = new Node(-20, 60, false, false, this.color, "I2");
        this.component.add(this.nodes[1].draw());
        this.nodes[0] = new Node(-20, 80, false, false, this.color, "I3");
        this.component.add(this.nodes[0].draw());

        this.startNodeId = this.nodes[3].id;
    }


    render() {

        const decimalDisplay = new Konva.Shape({
            x: 0, 
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();

                context.rect(0,0,80,100);
                
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0;
                for(let i = 20; i < 100; i += 20) {
                    context.moveTo(0, i);
                    context.lineTo(-20, i);
                    context.fillText(this.nodes[ii].label, 5, 5 + i)

                    ii++;
                }


                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })


        this.component.add(decimalDisplay, this.number);
        this.setupNodes();
        this.layer.add(this.component);
    }


    draw() {
        let input = 0;

        for (let i = 0; i != this.nodes.length; i++)
            if (this.nodes[i].value)
        	    input |= 1<<i;


        this.number.text(input);
    }

}