"use strict";

const headlineClass = "headline-word";
const hideClass = "hide";
const highlightClass = "highlight";
const initialAnimationDelay = 3000;
const longAnimationDelay = 1500;
const shortAnimationDelay = 250;

const State = Object.freeze({
    Type:   Symbol("Type"),
    Highlight:  Symbol("Highlight"),
    Delete: Symbol("Delete")
});

export default class HeadlineType {
    constructor(element) {
        this.element = element;
        this.words = Array.from(element.getElementsByClassName(headlineClass)).map(w => new Word(w));
        this.index = 0;
        this.state = State.Highlight;
        
        // Fix visibility. We want the word to visible but the letters to be hidden.
        for (var i = 0; i < this.words.length; i++) {
            const word = this.words[i];
            if (i !== this.index) {
                word.reset();
            }
            word.show();
        }

        setTimeout(() => this.animate(), initialAnimationDelay);
    }

    animate() {
        const word = this.words[this.index];
        let nextDelay = longAnimationDelay;

        switch (this.state) {
            case State.Highlight:
                word.highlight();
                this.state = State.Delete;
                break;

            case State.Delete:
                word.reset();
                this.index = (this.index + 1) % this.words.length;
                this.state = State.Type;
                nextDelay = shortAnimationDelay;
                break;

            case State.Type:
                if (word.type()) {
                    nextDelay = shortAnimationDelay;
                }
                else {
                    this.state = State.Highlight;
                }
                break;
        }

        setTimeout(() => this.animate(), nextDelay);
    }
}

class Word {
    constructor(element) {
        this.element = element;
        this.index = 0;
        const letters = element.innerHTML.split("");

        // Clear out the inner DOM.
        while (this.element.firstChild){
            this.element.removeChild(this.element.firstChild);
        }

        this.letterElements = letters.map(l => {
            const letter = document.createElement("span");
            const letterContent = document.createTextNode(l);
            letter.appendChild(letterContent);
            this.element.appendChild(letter);
            return letter;
        });
    }

    show() {
        this.element.classList.remove(hideClass);
    }

    hide() {
        this.element.classList.add(hideClass);
    }

    highlight() {
        this.element.classList.add(highlightClass);
    }

    reset() {
        this.element.classList.remove(highlightClass);
        this.letterElements.forEach(l => l.classList.add(hideClass))
        this.index = 0;
    }

    type() {

        var typed = undefined;

        do {
            const letter = this.letterElements[this.index];
            letter.classList.remove(hideClass);
            typed = letter.innerHTML;
            if (++this.index === this.letterElements.length) {
                return false;
            }
        } while (typed === " ");
        
        return true;
    }
}