import { MdPostAdd, MdAccessTime } from "react-icons/md";
import classes from "./TerminList.module.css";
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Termin from './Termin'



function TerminList({selectDate, selectMonth, selectYear, loadedData, deleteTerminList}) {
  return (
    <div>
    <h2>
      {selectDate}/{selectMonth}/{selectYear}
      </h2>
    <ul>
    {loadedData.length > 0 ? (
          loadedData.map((item) => (
              <>
              <Termin terminKey={item.id} 
                      name={item.prezime}
                      time={item.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + "-" + item.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      onDeleteTermin={deleteTerminList}>      
              </Termin>
              </>
          ))
        ) : (
          <li>Nema rezervacija</li>
        )}
    </ul>
    </div>
  );
}

export default TerminList;
