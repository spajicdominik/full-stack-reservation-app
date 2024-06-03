import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { useState } from 'react';


export default function Calendar({currentDate, changeDate}){
    
    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker 
      orientation="landscape" 
      label='Date Picker'
      value={currentDate}
      onChange={changeDate}
      />
    </LocalizationProvider>
    )
}