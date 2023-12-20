import { Node } from "./node.js";
import { Component } from "./component.js";


export class RGBLed extends Component{
    
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation);

        this.id = "RGB";
        this.colors = [0, 0, 0];
        this.editType = "noEdit";
    }


    setupNodes() {

        let shift = 0;

        for(let i = 0; i < 3; i++) {
            this.nodes[i] = new Node(-60, 0 + shift, false, false, this.color, this.id.split("")[i]);
            this.component.add(this.nodes[i].draw());

            shift += 20;
        }

        this.startNodeId = this.nodes[0].id;

    }


    render() {

        const RGBLed = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();
                context.moveTo(0,0);
                context.lineTo(30,0);
                context.quadraticCurveTo(50, 20, 30, 40);
                context.lineTo(0,40);

                context.closePath();


                context.fillStrokeShape(shape);
            },
            
            fill: `rgb(0,0,0)`,
            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        const posts = new Konva.Shape({

            sceneFunc: (context, shape) => {
                context.beginPath();

                context.moveTo(0, 10);
                context.lineTo(-10, 10);
                context.lineTo(-20, 0);
                context.lineTo(-60, 0);

                context.moveTo(0, 20);
                context.lineTo(-60, 20);

                context.moveTo(0, 30);
                context.lineTo(-10, 30);
                context.lineTo(-20, 40);
                context.lineTo(-60, 40);


                context.fillStyle = this.color;
                context.font = "bold 13px Arial";
                context.rotate(Math.PI/2);
                let shift = 5;

                for(let i = 0; i < 3; i++) {
                
                    context.fillText(this.nodes[i].label, shift, -5)

                    shift += 10;
                }

                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })


        this.component.add(RGBLed, posts);
        this.setupNodes();

        this.layer.add(this.component);

    }


    draw() {

        for(let i = 0; i < this.nodes.length; i++) {

            if(this.nodes[i].value)
                this.colors[i] = 255;
            else
                this.colors[i] = 0;
        }

        this.component.children[0].fill(`rgb(${this.colors[0]},${this.colors[1]},${this.colors[2]})`);
    }
}