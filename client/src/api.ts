import {ApplySuggestionsDto} from "../../spellcheck-api/src/documents/dto/applySuggestions.dto";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const addFile = (formData: FormData) => {
    return fetch(`${BASE_URL}/document/addFile`, {
        method: 'POST',
        body: formData
    });
};

const fetchDocument = (documentId) => {
    return fetch(`${BASE_URL}/document/${documentId}`);
};

const download = (documentId) => {
    return setTimeout(() => {
        const response = {
            file: `${BASE_URL}/document/download/${documentId}`,
        };
        window.open(response.file);
    }, 100);
};

const applySuggestions = (suggestions: ApplySuggestionsDto) => {
    return fetch(`http://localhost:3000/document/applySuggestions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(suggestions),
    });
};

export default {
    BASE_URL,
    addFile,
    fetchDocument,
    download,
    applySuggestions,
}
