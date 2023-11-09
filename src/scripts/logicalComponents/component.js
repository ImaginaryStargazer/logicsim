export class Component {
    constructor(x, y, color, highlightColor) {

        this.component = new Konva.Group({
            x: x,
            y: y,
            name: "component",
            draggable: true,
            width: 60,
            height: 80,
        })

        this.component.setAttr("componentType", this)
        
        this.color = color;
        this.highlightColor = highlightColor;
        this.strokeWidth = 3;


        this.component.on("mouseover", () => this.mouseOver());
        this.component.on("mouseout", () => this.mouseOut());
        this.component.on("contextmenu", () => {this.rightClick()});

    }


    mouseOver() {

        this.component.getChildren().forEach(shape => {
            shape.setAttrs({
                stroke: "red"
            })
        })
    }


    mouseOut() {

        this.component.getChildren().forEach(shape => {
            shape.setAttrs({
                stroke: "white"
            })
        })
    }


    toggle() {
        this.value ^= true;
    }


    rightClick() {
        
        return this;
    }
}

