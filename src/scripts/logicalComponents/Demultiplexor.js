import { Node } from "./node.js";
import { Component } from "./component.js";


export class Demultiplexor extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);


        this.id = "DEMUX";
        this.editType = "bitEdit";
        this.bits = 4;

    }

    setEditInfo(value) {

        this.bits = value;

    }


    setupNodes() {

        this.nodes[0] = new Node(80, 20, true, false, this.color, "Q0");
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(80, 40, true, false, this.color, "Q1");
        this.component.add(this.nodes[1].draw());
        this.nodes[2] = new Node(80, 60, true, false, this.color, "Q2");
        this.component.add(this.nodes[2].draw());
        this.nodes[3] = new Node(80, 80, true, false, this.color, "Q3");
        this.component.add(this.nodes[3].draw());

        this.nodes[4] = new Node(20, 140, false, false, this.color, "S0");
        this.component.add(this.nodes[4].draw());
        this.nodes[5] = new Node(40, 140, false, false, this.color, "S1");
        this.component.add(this.nodes[5].draw());

        this.nodes[6] = new Node(-20, 20, false, false, this.color, "Q");
        this.component.add(this.nodes[6].draw());

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const demultiplexor = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();

                context.rect(0, 0, 60, 120);
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0;
                
                for(let i = 20; i < 100; i+=20) {
                    context.moveTo(60, i);
                    context.lineTo(80, i);

                    

                    
                    context.fillText(this.nodes[ii].label, 35, 5 + i);

                    ii++;
                }

                for(let i = 20; i < 60; i+=20) {
                    context.moveTo(i, 120);
                    context.lineTo(i, 140);    
            
                    context.fillText(this.nodes[ii].label, i - 10, 115);

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

        this.component.add(demultiplexor);
        this.setupNodes();
        this.layer.add(this.component);

    }


    draw() {
        
        let selectedValue = 0;

        for(let i = 0; i != 2; i++) {

            if(this.nodes[i+4].value) {
                selectedValue |= 1<<i;
            }
        }

        for(let i = 0; i != 4; i++) {
            this.nodes[i].setValue(false);
        }

        this.nodes[selectedValue].setValue(this.nodes[6].value);

    }

}