import { icons } from "./icons.js";

class UserInterface {
    constructor() {
        this.theme = "dark";
        this.language = "english";
        this.circuitsCounter = 0;
        this.tutorialCounter = 0;
        this.showGrid = true;
        this.partsIEC = true;

        if (localStorage.getItem("language")) {
            this.language = localStorage.getItem("language");
        }
    }

    stringToHTML(str) {

        const parser = new DOMParser();
        const doc = parser.parseFromString(str, "text/html");
        return doc.body.firstChild;

    }

    render(html) {

        const domNode = this.stringToHTML(html);
        document.body.append(domNode);
        
    }

    handleChanges() {

        const grid = document.getElementById("grid");
        const IEC = document.getElementById("IEC");

        IEC.setAttribute("checked", this.partsIEC);
        grid.setAttribute("checked", this.showGrid);


        if (localStorage.getItem("show-again") == "false") {
            document.getElementById("modalWelcome").style.display = "none";
        }
    }

    attachEventListeners() {

        document.getElementById("saveProjectTitle").addEventListener("click", () => {this.changeProjectTitle()});

        document.getElementById("showAgain").addEventListener("click", (e) => {this.showTutorial(e)});

        document.querySelectorAll(".componentsTitle").forEach((category) => {category.addEventListener("click", (e) => {this.toggleComponentCategories(e)})});

        document.getElementById("partsPosition").onchange = (e) => {this.toggleComponentsMenuSide(e)};
    }


    //////////////////////////////////////////////////////////////////////////
    //
    // Hlavné menu, panely nástrojov a editor
    //
    //////////////////////////////////////////////////////////////////////////


    createMainNavigation() {

        const appMain = `
                <div class="mainMenu">
                    <div class="documentHolder">
                        <h4 class="appLogo">
                        <img id="logoHolder" class="appImg">
                        <span class="dash">-</span>
                        </h4>
                        <div class="appTitleHolder">
                        <div class="appTitle openModal" data-change="modalTitle" id="projectTitle">
                            ${lang[this.language].UntitledCircuit}
                        </div>
                        </div>
                    </div>
                    <div class="rightMenu">
                        <ul class="rightMenuItems">
                        ${this.createModalList(lang[this.language].Circuits, icons.circuits, "openModal", "modalCircuits")}
                        ${this.createModalList(lang[this.language].Docs, icons.docs, "openModal", "modalDocs")}
                        ${this.createModalList(lang[this.language].About, icons.about, "openModal", "modalAbout")}
                        ${this.createLink(lang[this.language].Github, icons.github)}
                        </ul>
                    </div>
                </div>
            `;

        this.render(appMain);

    }

    createMainToolbar() {

        const appToolbar = `
                <div class="appToolbar">
                    <ul class="appToolbarItems">
                        ${this.createToolkWithIcon(icons.newFile)}
                        ${this.createToolkWithIcon(icons.openFolder)}
                        ${this.createToolkWithIcon(icons.download)}
                        ${this.createToolkWithIcon(icons.netlist)}
                        ${this.createToolkWithIcon(icons.oscilloscope)}
                        ${this.createToolkWithIcon(icons.resetClock, "resetClock")}
                        ${this.createToolkWithIcon(icons.startSimulation, "startSimulation")}
                    </ul>
                    <ul class="appToolbarItems">
                        ${this.createToolkWithIcon(icons.options)}
                    </ul>
                </div>
            `;

        this.render(appToolbar);

    }

    createSidebarTool(innerIcon, tool, text) {

        return `<li selected-tool="${tool}" class="appToolbarItems editorTools">${innerIcon} ${text}</li>`;

    }


    createEditorToolsMenu() {

        const toolsMenu = `
            <div class="editorToolbar">
                <ul class="editorItems">
                    ${this.createSidebarTool(icons.zoomIn, "zoomIn", lang[this.language].ZoomIn)} 
                    ${this.createSidebarTool(icons.zoomOut, "zoomOut", lang[this.language].ZoomOut)}
                    ${this.createSidebarTool(icons.rotate, "rotate", lang[this.language].Rotate)}
                    ${this.createSidebarTool(icons.remove, "delete", lang[this.language].Delete)}
                    ${this.createSidebarTool(icons.clone, "clone", lang[this.language].Clone)}
                    ${this.createSidebarTool(icons.centerCircuit, "center", lang[this.language].Center)}
                </ul>

                <ul class="actionWrapper">
                    <li class="action"></li>
                </ul>
            </div>
        `;

        this.render(toolsMenu);
    }

    createMainBoard() {

        const mainBoardContainer = `
            <div id="mainBoardContainer">
                <div id="mainBoard" class="mainBoard"></div>
            </div>
        `;

        this.render(mainBoardContainer);
    }

    //////////////////////////////////////////////////////////////////////////
    //
    // Vytváranie tlačidiel, linkov, ikon, prepínačov
    //
    //////////////////////////////////////////////////////////////////////////


    createModalList(linkName, innerIcon, openModal, dataChange) {

        return `<li data-change="${dataChange}" class="mainLink ${openModal}">${innerIcon} ${linkName}</li>`;

    }

    createLink(linkName, innerIcon) {

        return `<li class="mainLink"><a class="link" href="https://github.com/jakubito11/LogicalCircuitSimulator">${innerIcon} ${linkName}</a></li>`;

    }

    createToolkWithIcon(innerIcon, id) {

        return `<li id="${id}" class="appToolbarItems">${innerIcon}</li>`;

    }

    createToggleSwitch(uniqueId, uniqueClass) {

        return `<label class="switch selectOption ${uniqueClass}"><input id="${uniqueId}" class="switchBox" type="checkbox"></input><span class="slider circle"></span></label>`;

    }

    createButton(classes = [], text, id, display) {

        return `<button style="display: ${display}" id="${id}" class="button ${classes.join(" ")}">${text}</button>`;

    }


    //////////////////////////////////////////////////////////////////////////
    //
    // Vytváranie nastavení vo vyskakovacom okne pre nastavenia
    //
    //////////////////////////////////////////////////////////////////////////

    createThemeOption() {

        return `

            <div class="options">
                <p>${lang[this.language].themeText}</p>
                <select id="theme" class="selectOption">
                    <option id="light" value="light-theme">${lang[this.language].Light_theme}</option>
                    <option id="dark" value="dark-theme">${lang[this.language].Dark_theme}</option>
                </select>
            </div>
        `;

    }

    createLanguageOption() {

        return `

            <div class="options">
                <p>${lang[this.language].languageText}</p>

                <select id="lang" class="selectOption">
                    <option id="en_US" value="english">English (EN)</option>
                    <option id="sk" value="slovak">Slovenčina (SK)</option>
                </select>
            </div>
        `;
    }

    createToggleOption(text, id) {

        return `<div class="options"><p>${text}</p>${this.createToggleSwitch(id)}</div>`;

    }

    changeVoltageColorOption() {

        return `
            <div class="options">
                <p>${lang[this.language].VoltageColor}</p>
                <input class="selectOption" placeholder="#FFFF00">
            </div>
        `;

    }

    //////////////////////////////////////////////////////////////////////////
    //
    // Vytváranie vyskakovacích okien
    //
    //////////////////////////////////////////////////////////////////////////

    createModalHeader(title) {

        return `

            <div class="topModal">
                <p>${title}</p>
                <div id="closeModal" class="closeButton">${icons.close}</div>
            </div>
        `;
    }

    createSampleCircuit(src, circuitName) {

        return `
        <div class="sampleCircuits">
            <img src="${src}">
            <p>${circuitName}</p>
        </div>
        `;
    }

    createCircuitsModal() {
        
        const circuitsModal = `
        <div id="modalCircuits" class="modal">
            <div style="width: 800px; height: auto;" class="modalContent">
                ${this.createModalHeader(lang[this.language].Circuits)}
                <div class="circuitsContainer">
                    <div id="circuitsGroup1">
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir1)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir2)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir3)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir4)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir5)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir6)}
                    </div>

                    <div id="circuitsGroup2" style="display: none">
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir7)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir8)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir9)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir10)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir11)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir12)}
                    </div>

                    <div id="circuitsGroup3" style="display: none">
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir13)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir14)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir15)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir16)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir17)}
                        ${this.createSampleCircuit(icons.circuit1, lang[this.language].SampleCir18)}
                    </div>
                </div>

                <div class="circuitsNav">
                    ${this.createButton(["previousButtonCircuits"], lang[this.language].Previous, "previousCircuitButton", "block")}
                    ${this.createButton(["nextButtonCircuits"], lang[this.language].Next, "nextCircuitButton", "block")}
                </div>

            </div>
        </div>
        `;


        this.render(circuitsModal);

    }

    createDocsModal() {

        const documentationModal = `
        <div id="modalDocs" class="modal">
            <div style="width: 600px; height: 600px;" class="modalContent">
                ${this.createModalHeader(lang[this.language].Docs)}
                <div class="documentationContainer">
                    <h1>--TO DO--</h1>
                </div>
            </div>
        </div>
        `;


        this.render(documentationModal);
    }

    createAboutModal() {

        const aboutModal = `
        <div id="modalAbout" class="modal">
            <div style="width: 500; height: auto;" class="modalContent">
                ${this.createModalHeader(lang[this.language].About)}
                <div class="aboutContainer">
                    <p class="projectName">${lang[this.language].projectName}: LogicSim</p>
                    <p class="author">${lang[this.language].author}: jakubito11</p>
                    <p class="aboutProject">${lang[this.language].About}: ${lang[this.language].aboutText}</p>
                    <h4 class="mainFunctions">${lang[this.language].mainFunctions}</h4>
                    <p>${lang[this.language].circuitDesign}: ${lang[this.language].circuitDesignText}</p>
                    <p>${lang[this.language].simulation}: ${lang[this.language].simulationText}</p>
                    <p>${lang[this.language].tutorial}: ${lang[this.language].tutorialText}</p>

                </div>
            </div>
        </div>
        `;


        this.render(aboutModal);
    }



    createModalOptions() {

        const modalOptions = `

            <div id="modalOptions" class="modal">
                <div style="width: 400px; height: auto;" class="modalContent">
                    ${this.createModalHeader(lang[this.language].Options)}
                    <div class="optionsContainer">
                        ${this.createThemeOption()}
                        ${this.createLanguageOption()}
                        ${this.createToggleOption(lang[this.language].displayText, "IEC")}
                        ${this.createToggleOption(lang[this.language].valuesText, "values")}
                        ${this.createToggleOption(lang[this.language].partsPosition, "partsPosition")}
                        ${this.createToggleOption(lang[this.language].grid, "grid")}
                        ${this.changeVoltageColorOption()}
                    </div>
                </div>
            </div>
        `;

        this.render(modalOptions);
    }

    createTitleModal() {
        const appTitleModal = `
            <div id="modalTitle" class="modal">
                <div style="width: 450px; height: 200px;" class="modalContent">
                    ${this.createModalHeader(lang[this.language].projectTitle)}
                    <div>
                        <input id="projectTitleInput" class="titleInput">
                        ${this.createButton(["saveButton"], lang[this.language].Save, "saveProjectTitle")}
                        ${this.createButton(["cancelSaveButton", "closeModalButton"], lang[this.language].Close, "closeTitleModal")}
                    </div>
                <div>
            <div>
        `;

        this.render(appTitleModal);
    }

    createNetlistModal() {

        const appNetlistModal = `
            <div id="modalNetlist" class="modal">
                <div style="width: 350px; height: 400px;" class="modalContent">
                    ${this.createModalHeader(lang[this.language].Circuit_netlist)}
                </div>
            </div>
        `;

        this.render(appNetlistModal);
    }

    createNewCircuitModal() {

        const appNew = `
            <div id="modalOpenFile" class="modal">
                <div style="width: 450px; height: 200px;" class="modalContent">
                    ${this.createModalHeader(lang[this.language].Save_project)}
                    <div>
                        <p class="saveText">${lang[this.language].saveText}</p>
                        ${this.createButton(["saveButton"], lang[this.language].Save)}
                        ${this.createButton(["cancelSaveButton", "closeModalButton"], lang[this.language].Dont_save)}
                    </div>
                <div>
            </div>
        `;

        this.render(appNew);
    }

    createWelcomeModal() {

        const modalWelcome = `
            <div style="display: block; background-color: #272727b2;" id="modalWelcome" class="modal">
                <div style="width: 600px; height: 400px;" class="modalContent">
                    ${this.createModalHeader(lang[this.language].Welcome)}
                    
                    <div>
                        <span style="display: none;" id="counter"><h4 id="count">${this.tutorialCounter}</h4><h4>/9</h4></span>
                        <div class="tutorialContent"><h3 id="tutorialTitle">${lang[this.language].WelcomeTitle}</h3><p id="tutorialText">${
            lang[this.language].WelcomeText
        }</p></div>
                        <label class="showLabel">${lang[this.language].Show}</label>
                        ${this.createToggleSwitch("showAgain", "dontShow")}
                        ${this.createButton(["previousButton"], lang[this.language].Previous, "previousButton", "none")}
                        ${this.createButton(["nextButton"], lang[this.language].Next, "nextButton", "none")}
                        ${this.createButton(["finishButton", "closeModalButton"], lang[this.language].Finish, "finishButton", "none")}
                        ${this.createButton(["startButton"], lang[this.language].StartTutorial, "startTutorial")}
                        ${this.createButton(["skipButton", "closeModalButton"], lang[this.language].SkipTutorial, "skipTutorial")}
                    </div>
                </div>
            <div>
        `;

        this.render(modalWelcome);
    }

    //////////////////////////////////////////////////////////////////////////
    //
    // Vytváranie menu komponentov
    //
    //////////////////////////////////////////////////////////////////////////


    createComponent(componentName, image, part) {

        return `<li part=${part} class="component">${componentName}<img class="componentImage" src=${image}></li>`;


    }

    createComponentToolbar() {

        const componentsToolbar = `
            <div id="componentsToolbar" class="componentsContainer">
                <div>
                    <p class="componentsTitle">${lang[this.language].Logical}</p>
                    <ul class="components">
                        ${this.createComponent(lang[this.language].Not, icons.IEC.Not, "NOT")}
                        ${this.createComponent(lang[this.language].And, icons.IEC.And, "AND")}
                        ${this.createComponent(lang[this.language].Or, icons.IEC.Or, "OR")}
                        ${this.createComponent(lang[this.language].Nor, icons.IEC.Nor, "NOR")}
                        ${this.createComponent(lang[this.language].Nand, icons.IEC.Nand, "NAND")}
                        ${this.createComponent(lang[this.language].Xor, icons.IEC.Xor, "XOR")}
                        ${this.createComponent(lang[this.language].Xnor, icons.IEC.Xnor, "XNOR")}
                    </ul>
                </div>
                <div>
                    <p class="componentsTitle">${lang[this.language].Inputs}</p>
                    <ul class="components">
                        ${this.createComponent(lang[this.language].LowInput, icons.IEC.LowInput, "LI")}
                        ${this.createComponent(lang[this.language].HighInput, icons.IEC.HighInput, "HI")}
                        ${this.createComponent(lang[this.language].ClockGen, icons.IEC.ClockGen, "CLK")}
                        ${this.createComponent(lang[this.language].ToggleSwitch, icons.IEC.ToggleSwitch, "LSW")}
                    </ul>
                </div>
                <div>
                    <p class="componentsTitle">${lang[this.language].Outputs}</p>
                    <ul class="components">
                        ${this.createComponent(lang[this.language].LogicalOutput, icons.IEC.LogicalOutput, "LO")}
                        ${this.createComponent(lang[this.language].Bulb, icons.IEC.LightBulb, "BLB")}
                    </ul>
                </div>
            </div>
        `;

        this.render(componentsToolbar);
    }




    initialise() {

        //  modals
        this.createWelcomeModal();
        this.createTitleModal();
        this.createNewCircuitModal();
        this.createNetlistModal();
        this.createModalOptions();
        this.createCircuitsModal();
        this.createDocsModal();
        this.createAboutModal();
      
        // UI elementy
        this.createMainNavigation();
        this.createMainToolbar();
        this.createComponentToolbar();
        this.createMainBoard();
        this.createEditorToolsMenu();
      
        // tutorial a nastavenie zmien
        this.toggleTutorialButtons();
        this.toggleCircuitsButtons();
        this.handleChanges();
        this.setColorTheme();
        this.setLanguage();
        this.attachEventListeners();
        this.handleModals();

      }

    //////////////////////////////////////////////////////////////////////////
    //
    // Funkcie pre posúvanie, schovávanie, ukazovanie okien, zmeny nastavení
    // používatelského rozhrania
    //
    //////////////////////////////////////////////////////////////////////////

    toggleTutorialButtons() {
        // nájdi elementy, ktoré budeme meniť

        const startTutorialBtn = document.getElementById("startTutorial");
        const skipTutorialBtn = document.getElementById("skipTutorial");
        const nextBtn = document.getElementById("nextButton");
        const previousBtn = document.getElementById("previousButton");
        const counter = document.getElementById("counter");

        startTutorialBtn.onclick = () => {
            // zmeň tlačidlá, ktoré ovládajú tutoriál

            skipTutorialBtn.style.right = "225px";
            startTutorialBtn.innerText = lang[this.language].Next;
            startTutorialBtn.style.display = "none";
            previousBtn.style.display = "block";
            nextBtn.style.display = "block";
            counter.style.display = "inline-flex";

            // začni tutoriál
            this.tutorialCounter++;
            this.nextOrPreviousClick();
        };

        // pokračuj v tutoriáli
        nextBtn.onclick = () => {
            if (this.tutorialCounter < 10) {
                this.tutorialCounter++;
                this.nextOrPreviousClick();
            }
        };

        // možnosť vrátenia sa naspäť
        previousBtn.onclick = () => {
            if (this.tutorialCounter > 1) {
                this.tutorialCounter--;
                this.nextOrPreviousClick();
            }
        };
    }


    toggleCircuitsButtons() {

        const nextBtn = document.getElementById("nextCircuitButton");
        const previousBtn = document.getElementById("previousCircuitButton");

        // ďalšie obvody
        nextBtn.onclick = () => {

            console.log(this.circuitsCounter);
            if (this.circuitsCounter < 2) {
                this.circuitsCounter++;
                this.nextOrPreviousClick();
            }
        };

        // možnosť vrátenia sa naspäť
        previousBtn.onclick = () => {
            if (this.circuitsCounter > 0) {
                this.circuitsCounter--;
                this.nextOrPreviousClick();
            }
        };
    }

    // ovládanie tutoriálu, zatiaľ len menenie textu v uvítacom okne
    nextOrPreviousClick() {
        // elementy ktoré sa budú meniť

        const nextButton = document.getElementById("nextButton");
        const finishButton = document.getElementById("finishButton");
        const tutorialTitle = document.getElementById("tutorialTitle");
        const tutorialText = document.getElementById("tutorialText");

        // obvody

        const circuits1 = document.getElementById("circuitsGroup1");
        const circuits2 = document.getElementById("circuitsGroup2");
        const circuits3 = document.getElementById("circuitsGroup3");


        // obnov počítadlo
        document.getElementById("count").innerText = this.tutorialCounter;

        if(modalCircuits.style.display == "block") {

            circuits1.style.display = "none";
            circuits2.style.display = "none";
            circuits3.style.display = "none";

            if (this.circuitsCounter == 0) {

                circuits1.style.display = "block"

            } else if (this.circuitsCounter == 1) {
                
                circuits2.style.display = "block"

            } else if (this.circuitsCounter == 2) {

                circuits3.style.display = "block"
            }


        }

        if(modalWelcome.style.display == "block") {

            // zmen inštrukcie tutoriálu
            if (this.tutorialCounter == 1) {
                tutorialTitle.innerText = "1";
                tutorialText.innerText = "1";
            } else if (this.tutorialCounter == 2) {
                tutorialTitle.innerText = "2";
                tutorialText.innerText = "2";
            } else if (this.tutorialCounter == 3) {
                tutorialTitle.innerText = "3";
                tutorialText.innerText = "3";
            } else if (this.tutorialCounter == 4) {
                tutorialTitle.innerText = "4";
                tutorialText.innerText = "4";
            } else if (this.tutorialCounter == 5) {
                tutorialTitle.innerText = "5";
                tutorialText.innerText = "5";
            } else if (this.tutorialCounter == 6) {
                tutorialTitle.innerText = "6";
                tutorialText.innerText = "6";
            } else if (this.tutorialCounter == 7) {
                tutorialTitle.innerText = "7";
                tutorialText.innerText = "7";
            } else if (this.tutorialCounter == 8) {
                tutorialTitle.innerText = "8";
                tutorialText.innerText = "8";

                nextButton.style.display = "block";
                finishButton.style.display = "none";
            } else if (this.tutorialCounter == 9) {
                tutorialTitle.innerText = "9";
                tutorialText.innerText = "9";

                nextButton.style.display = "none";
                finishButton.style.display = "block";
            }
        }
    }


    setColorTheme() {
        const darkTheme = "dark-theme";
        const lightTheme = "light-theme";
        const defaultTheme = darkTheme;
    
        const toggleTheme = document.getElementById("theme");
        let currentTheme = localStorage.getItem("color-theme") || defaultTheme;
    
        // Nastav defaultný vzhľad
        document.body.classList.add(currentTheme);
    
        // Nastav logo vzhľadom k vybranej téme
        logoHolder.src = icons[currentTheme];

        if (currentTheme === darkTheme) {
            dark.setAttribute("selected", true);
        } else if (currentTheme === lightTheme) {
            light.setAttribute("selected", true);
        }
    
        toggleTheme.addEventListener("change", () => {
            const option = toggleTheme.value;
    
            if ([darkTheme, lightTheme].includes(option)) {
                document.body.classList.replace(currentTheme, option);
                currentTheme = option;
                localStorage.setItem("color-theme", option);
                logoHolder.src = icons[currentTheme];
            }
        });
    }
    

    setLanguage() {

        const toggleLanguage = document.getElementById("lang");
        const currentLanguage = localStorage.getItem("language");

        switch (currentLanguage) {
            case "english":
                en_US.setAttribute("selected", true);
                break;
            case "slovak":
                sk.setAttribute("selected", true);
                break;
        }

        toggleLanguage.addEventListener("change", () => {
            const option = toggleLanguage.value;

            switch (option) {
                case "english":
                case "slovak":
                    localStorage.setItem("language", option);
                    location.reload();
                    break;
            }
        });
    }

    changeProjectTitle() {
        let title = projectTitleInput.value;

        if (title.trim() == "" || title.trim().length > 30 || title.trim().length < 4) {
            projectTitleInput.value = "";
            return;
        } else {
            projectTitleInput.value = "";
            modalTitle.style.display = "none";
            return (projectTitle.innerText = title);
        }
    }

    handleModals() {

        const btnModal = document.querySelectorAll(".openModal");
        const btnClose = document.querySelectorAll(".closeButton");
        const modals = document.querySelectorAll(".modalContent");
        const btnCloseModal = document.querySelectorAll(".closeModalButton");

        btnModal.forEach((btn) => {
            btn.onclick = () => {
                const openModal = btn.getAttribute("data-change");
                document.getElementById(openModal).style.display = "block";
            };
        });

        btnClose.forEach((btn) => {
            btn.onclick = () => {
                btn.closest(".modal").style.display = "none";
            };
        });

        btnCloseModal.forEach((btn) => {
            btn.onclick = () => {
                btn.closest(".modal").style.display = "none";
            };
        });

        document.addEventListener("keydown", (e) => {
            modals.forEach((modal) => {
                if (modal.closest(".modal").style.display == "block") {
                    if (e.key == "Escape") {
                        modal.closest(".modal").style.display = "none";
                    } else if (e.key == "Enter") {
                        this.changeProjectTitle();
                    }
                }
            });
        });

        modals.forEach((modal) => {

            let pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;

            const drag = (e) => {
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                modal.style.top = modal.offsetTop - pos2 + "px";
                modal.style.left = modal.offsetLeft - pos1 + "px";
            };

            modal.addEventListener("mousedown", (e) => {
                pos3 = e.clientX;
                pos4 = e.clientY;
                modal.classList.add("grabActive");
                document.addEventListener("mousemove", drag);
            });

            modal.addEventListener("mouseup", () => {
                modal.classList.remove("grabActive");
                document.removeEventListener("mousemove", drag);
            });
        });
    }

    toggleComponentCategories(e) {

        const clicked = e.target.nextElementSibling;

        clicked.classList.toggle("hidden");
    }


    toggleComponentsMenuSide(e) {

        const menu = document.getElementById("componentsToolbar");

        if (e.target.checked === true) {

            menu.style.float = "left";
            //menu.style.borderRight = "1px solid"

        } else {

            menu.style.float = "right";
            //menu.style.borderLeft = "1px solid"
        }

    }



    showTutorial(e) {

        if (e.target.checked === true) {

            localStorage.setItem("show-again", false);

        } else {

            localStorage.setItem("show-again", true);
        }
    }

}



const UI = new UserInterface();

UI.initialise();
