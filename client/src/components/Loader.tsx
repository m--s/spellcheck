import {LinearProgress} from "@material-ui/core";
import React from 'react';


export default function Loader(props) {
    if (props.loading) {
        return <LinearProgress />
    } else {
        return props.children
    }
};
