import React, {useEffect, useState} from 'react';
import {Box, Button, Paper, Typography} from "@material-ui/core";
import {useHistory, useParams} from "react-router";
import DocumentPreview from "../components/DocumentPreview";
import {ApplySuggestionsDto} from "../../../spellcheck-api/src/documents/dto/applySuggestions.dto";
import api from "../api";


function ShowDocument() {
    const {documentId} = useParams();
    const history = useHistory();

    const [document, setDocument] = useState({misspelledWords: [], accepted: false});

    const [chosenSuggestions, setChosenSuggestions] = useState({});

    const onSuggestionSelected = (e) => {
        setChosenSuggestions({...chosenSuggestions, ...e});
    };

    useEffect(() => {
        api.fetchDocument(documentId)
            .then(resp => resp.json())
            .then(resp => {
                setDocument(resp);

                const chosenSuggestionsMap = {};

                for (const misspelledWord of resp.misspelledWords) {
                    chosenSuggestionsMap[misspelledWord.id] = misspelledWord.suggestions.find(s => s.taken);
                }
                setChosenSuggestions(chosenSuggestionsMap);
        }).catch(() => {
            alert('Wrong document');
            history.push(`/`);
        });

    }, [history, documentId, document.accepted]);

    const applySuggestions = (documentId: number, suggestionIds: number[]) => {
        const body: ApplySuggestionsDto = {
            documentId,
            suggestionIds,
        };

        return api.applySuggestions(body);
    };

    const download = () => {
        api.download(documentId);
    };

    const saveDocument = () => {
        if (!documentId) {
            return;
        }

        let suggestionIds: number[] = Object.values(chosenSuggestions).filter(Boolean) as number[];
        if (suggestionIds.length === 0 || document.accepted) {
            download();
        } else {
            applySuggestions(+documentId, suggestionIds).then(() => {
                setDocument({...document, accepted: true});
                download();
            });
        }
    };


    const saveButtonText = document.accepted ? 'Download' : 'Save & download';

    return (
        <div>
            <Typography variant="h2">
                Document preview
            </Typography>
            <Paper>
                <Box p={5}>
                    <DocumentPreview value={document.body} readOnly={document.accepted}
                                     misspelledWords={document.misspelledWords}
                                     onSuggestionSelected={onSuggestionSelected}
                                     chosenSuggestions={chosenSuggestions}/>
                </Box>
            </Paper>

            <Box p={1}>
                <Button variant="contained" color="primary" onClick={saveDocument}>
                    { saveButtonText }
                </Button>
                <Button onClick={() => history.push(`/`)}>
                    New document
                </Button>
            </Box>
        </div>
    );
}

export default ShowDocument;
