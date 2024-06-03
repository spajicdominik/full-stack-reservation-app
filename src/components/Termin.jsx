import classes from "./Termin.module.css"
import React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

function Termin({name, time, terminKey, onDeleteTermin}) {
    return (
        <li key={terminKey} className={classes.post}>
            <div className={classes.right}>
            <p className={classes.author}>{name}</p>
            <p className={classes.text}>{time}</p>
            </div>
            
            <IconButton aria-label="delete" onClick={() => onDeleteTermin(terminKey)}>
            <DeleteIcon />
          </IconButton>
        </li>
    );
}

export default Termin;