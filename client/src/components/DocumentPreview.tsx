import React, {useEffect, useState} from 'react';
import DisplayWord from "./DisplayWord";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    documentPreview: {
        lineHeight: '2em',
    },
});

function splitSentenceIntoWords(sentence: string): string[] {
    const normalizedWhitespaces = sentence.replace(/\r?\n|\r/, ' ').replace(/\s\s+/g, ' ');
    return normalizedWhitespaces.split(' ');
}

function DocumentPreview(props) {
    const [words, setWords] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        if (!props.value) {
            setWords([]);
            return
        }

        const splitted = splitSentenceIntoWords(props.value);
        setWords(splitted);

    }, [props.value]);

    const onSuggestionSelected = (e) => {
        props.onSuggestionSelected(e);
    };

    const wordComponentParams = (word, misspelledWords) => {
        const normalizedWord = word.replace(/[\.|,|?|!|"]/g, '');

        const result = {
            isCorrect: true,
            onSuggestionSelected,
            chosenSuggestions: props.chosenSuggestions,
            misspelledWord: null,
            readOnly: props.readOnly,
        };
        for (const misspelledWord of misspelledWords) {
            if (normalizedWord.match('\\b' + misspelledWord.word + '\\b')) {
                result.isCorrect = false;
                result.misspelledWord = misspelledWord;
                break;
            }
        }
        return result;
    };

    return (
        <p className={classes.documentPreview}>{words.map((word, idx) => (
            <DisplayWord {...wordComponentParams(word, props.misspelledWords)} value={word} key={idx} />
        ))}</p>
    )
}
export default DocumentPreview;