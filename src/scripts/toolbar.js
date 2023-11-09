export function executeSelectedAction(callback) {

    const tools = document.querySelectorAll(".editorTools");
    
    const handleClick = (event) => {
        
        const selectedTool = event.currentTarget.getAttribute("selected-tool");

        callback(selectedTool);
        
    };
    
    tools.forEach((tool) => {
        tool.addEventListener("click", handleClick);
    });
}



