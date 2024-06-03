import * as React from "react";
import Button from "@mui/material/Button";
import Calendar from "./components/Calendar";
import MainHeader from "./components/MainHeader";
import classes from "./App.module.css";
import TerminList from "./components/TerminList";
import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import NewTermin from "./components/NewTermin";
import dayjs from 'dayjs';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('http://localhost:8080/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts.');
        }
        const resData = await response.json();
        setData(resData.map(item => ({
          ...item,
          start: new Date(item.start),
          end: new Date(item.end)
        })));
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      }
    }
    fetchPosts();
  }, []);


  const [error, setError] = useState('');


   const addTerminHandler = (terminData) => {        //primamo kao argument novounešeni termin iz NewTermin.jsx
     const selectedDay = dayjs(selectedDate.$d);     //pretvaramo odabrani dan sa kalendara u dayjs objekt
     const newTerminStart = dayjs(terminData.start); //pretvaramo početna i završna vremena našeg novog termina u dayjs objekt
     const newTerminEnd = dayjs(terminData.end);

     const conflict = data.some((item) => {    //iteriramo kroz svaki objekt arraya data i provjeravamo odgovara li kome sljedeći uvjeti (funkcija conflict vraća bool true ili false)
       const itemStart = dayjs(item.start);    //početak termina trenutnog objekta u iteraciji 
       const itemEnd = dayjs(item.end);        //završetak termina trenutnog objekta u iteraciji
       return (
         itemStart.isSame(selectedDay, 'day') &&     //provjerava jel datum trenutnog objekta u iteraciji jednak odabranom objektu u kalendaru
         (
            (newTerminStart.isAfter(itemStart) && newTerminStart.isBefore(itemEnd)) ||      //provjerava je li početak našeg novog termina između početka i završetka termina trenutnog objekta u iteraciji
          (newTerminEnd.isAfter(itemStart) && newTerminEnd.isBefore(itemEnd)) ||          //provjerava je li kraj našeg novog termina između početka i završetka termina trenutnog objekta u iteraciji
          (newTerminStart.isSame(itemStart) || newTerminEnd.isSame(itemEnd)) ||           //provjerava je li početak našeg novog termina jednak početku ili završetku termina trenutnog objekta u iteraciji 
          (newTerminStart.isBefore(itemStart) && newTerminEnd.isAfter(itemEnd))           //provjerava jel naš novi termin u potpunosti "prekriva" cijeli termin trenutnog objekta u iteraciji
        )
      );
    });

    if (conflict) {
      setError('Termin je zauzet!');   //ako conflict vraća true bacamo error i ne dodajemo termin
      return;
    }

    setData((prevData) => [     //funkcija koja updatea trenutno stanje sa novim terminom; kao parametar prima prevData (trenutno stanje termina)
      ...prevData,                  
      { id: prevData.length + 1, ...terminData },       //funkcija vraća novi array sa svim prethodnim terminima i dodaje naš novi termin te mu dodaje i id koji je veličine prethodnog arraya + 1
    ]);
    setError('');      //čisti bilo kakve postojeće errore
    setModalVisible(false);
  };




  /*const addTerminHandler = (terminData) => {
    setData((prevData) => [
      ...prevData,
      { id: prevData.length + 1, ...terminData },
    ]);
  };
  */

  /*useEffect(() => {
    if (selectedDate) {
      console.log(selectedDate.$d);
      console.log(data[0].start)
    } else {
      console.log('Selected date is null');
    }
  }, [selectedDate]);
*/

  function dateChangeHandler(newValue) {      //funkcija za ažuriranje odabranog datuma
    setSelectedDate(newValue);
    setError('');
  }

  const filteredData = selectedDate
    ? data.filter(
        (item) =>
          item.start.getDate() === selectedDate.$d.getDate() &&
          item.start.getMonth() === selectedDate.$d.getMonth() &&
          item.start.getFullYear() === selectedDate.$d.getFullYear()
      )
      .sort((a, b) => a.start - b.start)
    : [];
  
  const [modalVisible, setModalVisible] = useState(false);

  function showModalHandler(event){
    setModalVisible(true)
  }

  function hideModalHandler(event){
    setModalVisible(false);
    setError('');
  }

  const deleteTerminHandler = (id) => {
    setData((prevData) => prevData.filter((termin) => termin.id !== id));
  };
  

  return (
    <>
      <MainHeader onCreatePost={showModalHandler}></MainHeader>
      <main>
        {
          modalVisible ? (
            <Modal hideModal={hideModalHandler}>
              <NewTermin
                onCancel={hideModalHandler} 
                onAddTermin={addTerminHandler}
                selectedDate={selectedDate}>
              </NewTermin>
              {error && <p className={classes.error}>{error}</p>}
            </Modal>
          ) : (
            null
          )
        }

        <div className={classes.mainDiv}>
          
          <div className={classes.leftDiv}>
            <Calendar
              currentDate={selectedDate}
              changeDate={dateChangeHandler}
            ></Calendar>
          </div>
          
          {selectedDate ? (
            <div className={classes.rightDiv}>  
            <TerminList selectDate={selectedDate.$d.getDate()}
                        selectMonth={selectedDate.$d.getMonth() + 1}
                        selectYear={selectedDate.$d.getFullYear()}
                        loadedData={filteredData}
                        deleteTerminList={deleteTerminHandler}></TerminList> 
          </div>
          ) : false}

        </div>
      </main>
    </>
  );
}

export default App;


/**/