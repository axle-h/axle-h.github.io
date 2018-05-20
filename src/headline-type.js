"use strict";

const arrayFrom = require("array-from");

const headlineClass = "headline-word";
const hideClass = "hide";
const selectedClass = "selected";
const initialAnimationDelay = 3000;
const longAnimationDelay = 1500;
const selectedAnimationDelay = 400;
const shortAnimationDelay = 150;

const State = Object.freeze({
    Type:   "Type",
    Selected:  "Selected",
    Delete: "Delete"
});

export default class HeadlineType {
    constructor(element) {
        this.element = element;
        this.words = arrayFrom(element.getElementsByClassName(headlineClass)).map(w => new Word(w));
        this.index = 0;
        this.state = State.Selected;
        
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
        let nextDelay = shortAnimationDelay;

        switch (this.state) {
            case State.Selected:
                word.select();
                this.state = State.Delete;
                nextDelay = selectedAnimationDelay;
                break;

            case State.Delete:
                word.reset();
                this.index = (this.index + 1) % this.words.length;
                this.state = State.Type;
                break;

            case State.Type:
                if (!word.type()) {
                    this.state = State.Selected;
                    nextDelay = longAnimationDelay;
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

    select() {
        this.element.classList.add(selectedClass);
    }

    reset() {
        this.element.classList.remove(selectedClass);
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