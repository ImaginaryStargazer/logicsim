import { Component } from "./component.js";
import { Node } from "./node.js";

export class LogicalSwitch extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);


        this.id = "LSW";
        this.editType = "labelEdit";
        this.label = "";
        this.component.setAttr("id", this.id);

        this.component.on("pointerclick", () => {this.click()});

    }

    setEditInfo() {
        
        const labelInput = document.getElementById("labelEdit").value;

        this.label = labelInput;
        this.labelInfo.text(this.label);
        this.labelInfo.x(-this.labelInfo.width() / 2 + 20)

    }

    setupNodes() {

        this.nodes[0] = new Node(100, 20, true, false, this.color);
        this.nodes[0].createPin(40, 20, 100, 20, this.component);

        this.startNodeId = this.nodes[0].id;
    }

    render() {
        
        const removeLabel = document.getElementById("removeLabel");

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

        this.labelInfo.x(-this.labelInfo.width() / 2 + 20);
        
        this.button = new Konva.Circle({
            x: 20,
            y: 20,
            radius: 10,
            strokeWidth: 2,
            stroke: this.color,
            id: "button"
        })

        removeLabel.onclick = () => {
            this.label = "";
            this.labelInfo.text(this.label);
        }


        this.setupNodes();
        this.component.add(body, this.button, this.labelInfo);
        this.fillButton();
        
        this.layer.add(this.component);
    }

    execute() {

    }


    click() {
        this.toggle();
        this.fillButton();
    
    }


    fillButton() {
        this.nodes[0].setValue(this.value);
        if(this.nodes[0].getValue()) 
            this.button.fill("green");
        else
            this.button.fill("#343a40");
    }

}
