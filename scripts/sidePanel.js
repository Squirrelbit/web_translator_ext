import FetchTranslation from './FetchTranslation.js';

let isEnabled = true;
let outputElement;
let languagesFromSelect;
let languagesToSelect;
let typeOfSelect;
let textInput;

document.addEventListener('DOMContentLoaded', setupSelectors);

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SELECTED_TEXT") {
    translate(typeOfSelect.value,languagesFromSelect.value,languagesToSelect.value,message.text);
  }
});

function setupSelectors() {
    document.getElementById("enableButton").addEventListener('click', toggleEnabled);
    
    outputElement = document.getElementById("result");

    languagesFromSelect = document.getElementById("languagesFrom");
    createSelectorFromArray(languagesFromSelect,FetchTranslation.languages,FetchTranslation.languageNames);

    languagesToSelect = document.getElementById("languagesTo");
    createSelectorFromArray(languagesToSelect,FetchTranslation.languages,FetchTranslation.languageNames);
    
    typeOfSelect = document.getElementById("type");
    createSelectorFromArray(typeOfSelect,FetchTranslation.translateActions,FetchTranslation.translateActions);
    
    textInput = document.getElementById("typeWord");
    textInput.addEventListener('change', function() { //input is real-time, change is when entered
        translate(typeOfSelect.value,languagesFromSelect.value,languagesToSelect.value,textInput.value);
    })
;}

function translate(action,lang1,lang2,wd) {
    FetchTranslation.main(action,lang1,lang2,wd).then(result => { 
        setTranslationOutput(wd,result,outputElement);
    });
}

function toggleEnabled() {
    isEnabled = !isEnabled;
}

function setTranslationOutput(word, result, output) {
    output.textContent = word;
    let containsExample;
    for (const definition of result) {
        let defHTML = document.createElement('li');
        let exampleHTML;
        let exampleHolder;
        if ((containsExample = definition.indexOf(":")) !== -1) {
            defHTML.textContent = definition.substring(0,containsExample); 

            exampleHTML = document.createElement('li');
            exampleHTML = definition.substring(containsExample+1);

            exampleHolder = document.createElement("ul");
            exampleHolder.append(exampleHTML);
            defHTML.append(exampleHolder);
            
        } else defHTML.textContent = definition;
        defHTML.textContent.replace("/[\n\r]/g", " ");
        output.appendChild(defHTML);
        
    }
}

function createSelectorFromArray(selector,valueArray,textArray) {
    let currentOption;
    for (let i=0; i<valueArray.length; i++) {
        currentOption = document.createElement("option");
        currentOption.value = (valueArray[i]);
        currentOption.textContent = textArray[i];
        selector.append(currentOption);
    }
}
