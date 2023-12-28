import { Node } from "./node.js";
import { Component } from "./component.js";


export class LEDarray extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "LDA";
        this.editType = "ledArrEdit";
        this.LED = [];
        this.numOfRows = 4;
        this.numOfCols = 4;
        this.ledColor = "red";
    }

    setEditInfo() {

        let colorValue = document.getElementById("ledArrColor").value;
        let rowsValue = document.getElementById("rows").value;
        let colsValue = document.getElementById("cols").value;

        if(!Number(rowsValue) || !Number(colsValue) || Number(colsValue) < 0 || Number(rowsValue) < 0) return;

        this.destroy();
        this.LED = [];

        this.numOfRows = Number(rowsValue);
        this.numOfCols = Number(colsValue);
        this.ledColor = colorValue;

        this.render();
    }

    setupNodes() {

        let shift = 20;


        for(let row = 0; row < this.numOfRows; row++) {
            
            this.nodes[row] = new Node(-20, shift, false, false, this.color, "ROW" + row);
            this.nodes[row].createPin(0, shift, -20, shift, this.component);

            shift +=20;
        }

        shift = 20;

        for(let col = 0; col < this.numOfCols; col++) {
            this.nodes[col + this.numOfRows] = new Node(shift, this.numOfRows * 20 + 40, false, false, this.color, "COL" + col);
            this.nodes[col + this.numOfRows].createPin(shift, this.numOfRows * 20 + 20, shift, this.numOfRows * 20 + 40, this.component);

            shift +=20;
        }


        this.startNodeId = this.nodes[0].id;

    }


    render() {

        const LEDarray = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();

                context.rect(0, 0, this.numOfCols * 20 + 20 , this.numOfRows * 20 + 20);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        let shiftX, shiftY = 0;


        for (let i = 0; i < this.numOfRows; i++) {

            shiftX = 0;
            shiftY += 20;

            for (let j = 0; j < this.numOfCols; j++) {

                shiftX += 20;

                const newLED = new LED(shiftX, shiftY);
                this.LED.push(newLED);

                for(let i = 0; i < this.LED.length; i++) {
                    this.LED[i].LED.setAttr("fill", this.ledColor);
                }

                this.component.add(newLED.render());

                
            }

        }

        this.setupNodes();
        this.component.add(LEDarray);

        this.layer.add(this.component)
        


    }


    draw() {
        
        for (let i = 0; i < this.numOfRows; i++) {
            
            if (this.nodes[i].value) {

                for (let row = 0; row < this.numOfCols; row++) {
                    this.LED[i * this.numOfCols + row].turnOn();
                }

            } else {
                for (let row = 0; row < this.numOfCols; row++) {
                    this.LED[i * this.numOfCols + row].turnOff();
                }
            }
        }

        for (let i = this.numOfRows; i < this.numOfRows + this.numOfCols; i++) {
            
            if (this.nodes[i].value) {
                for (let col = 0; col < this.numOfRows; col++) {
                    this.LED[col * this.numOfCols + (i - this.numOfRows)].turnOff();
                }
            }
        }

            
    }
    
}


class LED{
    constructor(x, y) {

        this.LED = new Konva.Circle({
            x: x,
            y: y,
            fill: "red",
            radius: 8,
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
