import { Component } from "./component.js";
import { Node } from "./node.js";

export class LogicalOutput extends Component {

    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);


        this.id = "OUT";
        this.editType = "labelEdit";
        this.label = "";

    }


    setEditInfo() {
        const labelInput = document.getElementById("labelEdit").value;

        const removeLabel = document.getElementById("removeLabel");

        removeLabel.onclick = () => {
            this.labelInfo.text("")
        }

        this.label = labelInput;
        this.labelInfo.text(this.label);
        this.labelInfo.x(-this.labelInfo.width() / 2 + 20)
    }

    setupNodes() {

        this.nodes[0] = new Node(-60, 20, false, false, this.color);
        this.nodes[0].createPin(0, 20, -60, 20, this.component);

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const body = new Konva.Rect({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            stroke: this.color,
            strokeWidth: 2
        })
        
        this.labelInfo = new Konva.Text({
            y: -30,
            fill: this.color,
            text: this.label,
            fontSize: 25,
            strokeWidth: this.strokeWidth,
        })
        
        this.labelInfo.x(-this.labelInfo.width() / 2 + 20)

        this.textValue = new Konva.Text({
            x: 10,
            y: 11,
            fill: this.color,
            text: "?",
            fontSize: 25,
        })

        this.setupNodes();
        this.component.add(body, this.textValue, this.labelInfo);
        this.layer.add(this.component);
    }


    draw() {
        if(this.nodes[0].getValue())
            this.textValue.text("1")
        else 
            this.textValue.text("0")
    }


}