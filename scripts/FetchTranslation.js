"use strict";

export default class FetchTranslation {
    static parser = new DOMParser();
    static languages = [   'en','es','de','fr','it','ca',
                    'nl','sv','ru','pt','pl','ro',
                    'cs','el','tr','zh','ja','ko',
                    'ar','is',];
    
    static languageNames = [   'English','Spanish','German',
                        'French','Italian','Catalan',
                        'Dutch','Swedish','Russian',
                        'Portuguese','Polish','Romanian',
                        'Czech','Greek','Turkish',
                        'Chinese','Japanese','Korean',
                        'Arabic', 'Icelandic', ];

    static translateActions = [
        "definition",
        "conjugation",
        "collocation",
        "synonyms",
        "usage",
        "translation"
    ];

    static async main(action,lang1,lang2,word) {
        let url = this.generateLink(action,lang1,lang2,word);
        try {
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            let text = await response.text();
            let result = this.parsePageOld(action,lang1,lang2, text);
            return result;
        } catch (e) {
            throw e;
        }
    }

    static wordRefClassName(action, lang) {
        // returns the class name of the element that contains the desired translation/whatever.
        // the second item of the array (if it exists) is the name of an HTML element within the class given
        // that actually contains text result.
        switch (action) {
            case "definition":
                if (lang === "en") return [ "rh_def" ];
                else return [ "entry" ];
            case "conjugation":
                return [ "conjugation" ];
            case "collocation":
                // does not directly contain: POS's are in <span class="POS">, items are in unmarked <li>s
                return [ "trans collocationsusuk clickable clickTranslate noTapHighlight", "li" ]
            case "synonyms":
                // synonyms does not directly contain the word; words are located in unmarked <span>s
                if (lang === "en") return [ "clickable engthes clickTranslate noTapHighlight", "span" ];
                else return [ "clickable esp clickTranslate noTapHighlight", "span" ];
            case "usage":
                // result is in an unmarked <p> element.
                return [ "entry", "p" ];
            case "translation":
                return [ "ToWrd" ];
        }
    }

    static parsePageOld(action,lang1,lang2,text) {
        const resultHTML = this.parser.parseFromString(text, "text/html");//.getElementsByClassName("ToWrd");
        let classesContainResult = this.wordRefClassName(action, lang1);
        
        console.log(classesContainResult[0]);
        console.log(resultHTML.getElementsByClassName(classesContainResult[0]));
        
        if (classesContainResult.length === 1) {
            let resultCollection = Array.from(resultHTML.getElementsByClassName(classesContainResult[0]),(text) => text.innerText);
            console.log(resultCollection);
            return resultCollection;
        } else {
            let resultContainer = resultHTML.getElementsByClassName(classesContainResult[0]);
            return resultContainer;
        }
    }

    static generateLink(action,lang1,lang2,word) {
        switch (action) {
            case "translation":
                return this.generateTranslationLink(lang1,lang2,word);
            case "definition":
                return this.generateDefinitionLink(lang1,word);
            case "synonyms":
                return this.generateSynonymLink(lang1,word);
            case "conjugate":
                return this.generateConjugateLink(lang1,word);
            case "collocation":
                return this.generateCollocationLink(lang1,word);
            case "usage":
                return this.generateUsageLink(lang1,word);
            default:
                console.log("Invalid arguments to generateLink: " + action + " is not in " + this.translateActions);
                throw new Error(message="Invalid arguments to generateLink: " + action + " is not in " + this.translateActions);
        }
    }

    static generateTranslationLink(lang1,lang2,word) { return "https://wordreference.com/" + lang1 + lang2 + "/" + word; }
    
    static generateDefinitionLink(lang1,word) { 
        switch (lang1) {
            case "en":
                return "https://wordreference.com/definition/" + word;
            case "es":
                return "https://wordreference.com/definicion/" + word;
            case "ca":
                return "https://wordreference.com/definicio/" + word;
            default:
                throw new Error(message="Invalid arguments to generateDefinitionLink: " + lang1 + " does not have definition options")
        }
    }
    static generateSynonymLink(lang1,word) {
        switch (lang1) {
            case "en":
                return "https://wordreference.com/synonyms/" + word;
            case "es":
                return "https://wordreference.com/sinonimios/" + word;
            default:
                throw new Error(message="Invalid arguments to generateSynonymLink: " + lang1 + " does not have synonym options")
        }
    }

    static generateConjugateLink(lang1,word) {
        return "https://www.wordreference.com/conj/" + lang1 + "verbs.aspx?v=" + word;
    }

    static generateCollocationLink(lang1, word) { 
        switch (lang1) {
            case "en":
                return "https://www.wordreference.com/englishcollocations/" + word; 
            default:
                throw new Error(message="Invalid arguments to generateCollocationLink: " + lang1 + " does not have collocation options")
        }
    }

    static generateUsageLink(lang1, word) { 
        switch (lang1) {
            case "en":
                return "https://www.wordreference.com/englishusage/" + word;
            default:
                throw new Error(message="Invalid arguments to generateUsageLink: " + lang1 + " does not have usage options")
        }
    }
};