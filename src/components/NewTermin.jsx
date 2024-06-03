import classes from "./NewTermin.module.css";
import { useState } from "react";
import dayjs from 'dayjs';
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


function NewTermin({onCancel, onAddTermin, selectedDate, setError}){
    const [enteredName, setEnteredName] = useState("");
    const [startTime, setStartTime] = useState(dayjs());
    const [endTime, setEndTime] = useState(dayjs());
    
    
      function nameChangeHandler(event) {
        setEnteredName(event.target.value);
      }

      const handleStartTimeChange = (newValue) => {
        setStartTime(newValue);
      };
    
      const handleEndTimeChange = (newValue) => {
        setEndTime(newValue);
      };
    
    
      const submitHandler = (event) => {
        event.preventDefault();
        const startDateTime = dayjs(selectedDate)
          .hour(startTime.hour())
          .minute(startTime.minute())
          .second(0)
          .millisecond(0);
        const endDateTime = dayjs(selectedDate)
          .hour(endTime.hour())
          .minute(endTime.minute())
          .second(0)
          .millisecond(0);
        const terminData = {
          prezime: enteredName,
          start: startDateTime.toDate(),
          end: endDateTime.toDate(),
        };
        onAddTermin(terminData);
      };

    return(
        <>
        <form className={classes.form} onSubmit={submitHandler}>
      <p>
        <label htmlFor="name">Prezime</label>
        <input type="text" id="name" required onChange={nameChangeHandler} />
      </p>
      <p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Start Time"
          value={startTime}
          onChange={handleStartTimeChange}
          renderInput={(params) => <TextField {...params} />}
          ampm={false}
        />
        </LocalizationProvider>
      </p>
      <p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="End Time"
          value={endTime}
          onChange={handleEndTimeChange}
          renderInput={(params) => <TextField {...params} />}
          ampm={false}
        />
        </LocalizationProvider>
      </p>
      <p className={classes.actions}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button>Rezerviraj</button>
      </p>
    </form>
        </>
    );
}

export default NewTermin;