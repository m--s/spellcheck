import React from 'react';
import {Box, Button, Container, LinearProgress, Typography} from "@material-ui/core";
import {useHistory} from "react-router";
import api from "../api";
import Loader from "../components/Loader";

function AddDocument() {
    const [file, setFile] = React.useState();
    const [isLoading, setLoading] = React.useState(false);
    const history = useHistory();


    const handleBodyChange = (e: React.ChangeEvent<any>) => {
        const files: Blob[] = Array.from(e.target.files);

        if (files.length) {
            setFile(files[0]);
        } else {
            setFile(null);
        }
    };

    const submit = async () => {
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);

        const req = await api.addFile(formData);
        const document = await req.json();
        history.push(`/document/${document.id}`);
    };



  return (
    <Container>
        <Typography variant="h2">
            Add document
        </Typography>
        <form>

            <Loader loading={isLoading}>
                <Box p={1}>
                    <input id="file" type="file" required onChange={handleBodyChange} accept="text/plain"  />
                </Box>
                <Box p={1}>
                <Button variant="contained" color="primary" disabled={!file} onClick={() => submit()}>
                        New document
                    </Button>
                </Box>
            </Loader>
        </form>
    </Container>
  );
}

export default AddDocument;
