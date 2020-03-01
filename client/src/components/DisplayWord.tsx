import React, {useState} from 'react';
import {Button, ButtonGroup, Popover} from "@material-ui/core";

function CorrectWord(props) {
    return <>{props.value} </>
}

function MisspelledWord(props) {
    const [isOpen, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        if (props.readOnly) {
            return;
        }
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false);
    };

    const SuggestionButton = (suggestionButtonProps) => {
        const commonProps: any = {
            disabled: props.chosenSuggestions[props.misspelledWord.id] === suggestionButtonProps.suggestionId,
            key: suggestionButtonProps.key,
            onClick: (e) => onSuggestionSelected(suggestionButtonProps)
        };

        if (suggestionButtonProps.type === 'misspelled') {
            const buttonProps = {...commonProps, color: 'secondary' };
            return <Button {...buttonProps}> {suggestionButtonProps.value} </Button>
        } else {
            const buttonProps = {...commonProps, color: 'primary' };
            return <Button color="primary" {...buttonProps}> {suggestionButtonProps.value} </Button>

        }
    };

    const onSuggestionSelected = (e) => {
        handleClose();

        const output = {};
        if (e.type === 'misspelled') {
            output[props.misspelledWord.id] = undefined;
        } else {
            output[props.misspelledWord.id] = props.misspelledWord.suggestions.find(
                suggestion => suggestion.suggestion === e.value
            )?.id;
        }
        props.onSuggestionSelected(output);

    };

    const Buttons = () => {

        return <ButtonGroup>
            <SuggestionButton value={props.value} type="misspelled" />
            {props.misspelledWord.suggestions.map((option, idx) => {
                    return <SuggestionButton key={idx} type="suggestion" suggestionId={option.id}
                                             value={option.suggestion} />
                }
            )};
        </ButtonGroup>;
    };

    const SuggestionsTooltip = () => {
        return <Popover open={isOpen} anchorEl={anchorEl} onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
        >
            <Buttons />
        </Popover>
    };

    const fixed = props.chosenSuggestions[props.misspelledWord.id] !== undefined;

    const baseStyle = {
        padding: '3px',
        margin: '0 5px 0 5px',
        cursor: props.readOnly ? 'default' : 'pointer',
    };

    if (fixed) {
        const correctedWord = props.misspelledWord.suggestions.find(
            suggestion => suggestion.id === props.chosenSuggestions[props.misspelledWord.id]
        ).suggestion;


        return <>
            <span
                onClick={handleClick}
                style={{...baseStyle, border: '1px solid #3f51b5'}}>{ correctedWord }</span>
            <SuggestionsTooltip />
        </>;
    } else {
        let border = '1px solid #f50057';
        if (props.readOnly) {
            border = '1px dotted #ffcdd2';
        }

        return <>
            <span
                onClick={handleClick}
                style={{...baseStyle, border }}>{props.value}</span>
            <SuggestionsTooltip/>
        </>;
    }
}

function DisplayWord(props) {
    if (props.isCorrect) {
        return <CorrectWord {...props} />
    } else {
        return <MisspelledWord {...props} />
    }
}

export default DisplayWord;