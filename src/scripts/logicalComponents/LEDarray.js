import { Node } from "./node.js";
import { Component } from "./component.js";


export class LEDarray extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "LDA";
        this.editType = "colorEdit";
        this.ledColor = "red";
        this.LED = [];
    }

    setupNodes() {

        let shiftX = 20;
        let shiftY = 20;

        for(let row = 0; row < 4; row++) {
            
            this.nodes[row] = new Node(-20, shiftX, false, false, this.color, "ROW" + row);
            this.component.add(this.nodes[row].draw());

            shiftX +=20;
        }



        for(let col = 0; col < 4; col++) {
            this.nodes[col + 4] = new Node(shiftY, 120, false, false, this.color, "COL" + col);
            this.component.add(this.nodes[col + 4].draw());

            shiftY +=20;
        }


        this.startNodeId = this.nodes[0].id;


    }


    render() {

        const LEDarray = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();

                context.rect(0, 0, 100, 100);

                for(let i = 20; i < 100; i+=20) {
                    context.moveTo(0, i);
                    context.lineTo(-20,i);
                    context.moveTo(i, 100);
                    context.lineTo(i, 120);
                }

                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        let shiftX, shiftY = 0;


        for (let i = 0; i < 4; i++) {

            shiftX = 0;
            shiftY += 20;

            for (let j = 0; j < 4; j++) {

                shiftX += 20;

                const newLED = new LED(shiftX, shiftY);
                this.LED.push(newLED);
                this.component.add(newLED.render());

                
            }

        }


        console.log(this.LED)

        this.component.add(LEDarray);
        this.setupNodes();
        this.layer.add(this.component)
        


    }


    draw() {
        
        for (let i = 0; i < 4; i++) {
            
            if (this.nodes[i].value) {

                for (let row = 0; row < 4; row++) {
                    this.LED[i * 4 + row].turnOn();
                }

            } else {
                for (let row = 0; row < 4; row++) {
                    this.LED[i * 4 + row].turnOff();
                }
            }
        }

        for (let i = 4; i < 8; i++) {
            
            if (this.nodes[i].value) {
                for (let col = 0; col < 4; col++) {
                    this.LED[col * 4 + (i - 4)].turnOff();
                }
            }
        }

            
    }
    
}


class LED {
    constructor(x, y) {

        this.LED = new Konva.Circle({
            x: x,
            y: y,
            radius: 8,
            fill: "red",
            strokeEnabled: false,
            opacity: 0.2,
        })

        this.w = 0;
    }

    render() {

        return this.LED;
    }

    turnOn() {

        this.w = Math.min(1, this.w + 0.004);

        this.LED.setAttrs({
            opacity: this.w
        });

        
    }

    turnOff() {


        this.w = Math.max(0.2, this.w - 0.005);

        this.LED.setAttrs({
            opacity: this.w
        });
        
    }


}
