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

  const [error, setError] = useState('');

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

  const addTerminHandler = async (terminData) => { 
    const selectedDay = dayjs(selectedDate.$d);     
    const newTerminStart = dayjs(terminData.start);
    const newTerminEnd = dayjs(terminData.end);

    const conflict = data.some((item) => {
      const itemStart = dayjs(item.start); 
      const itemEnd = dayjs(item.end);  
      return (
        itemStart.isSame(selectedDay, 'day') &&     
        (
          (newTerminStart.isAfter(itemStart) && newTerminStart.isBefore(itemEnd)) ||      
          (newTerminEnd.isAfter(itemStart) && newTerminEnd.isBefore(itemEnd)) ||          
          (newTerminStart.isSame(itemStart) || newTerminEnd.isSame(itemEnd)) ||           
          (newTerminStart.isBefore(itemStart) && newTerminEnd.isAfter(itemEnd))           
        )
      );
    });

    if (conflict) {
      setError('Termin je zauzet!'); 
      return;
    }

    const newTermin = { id: data.length + 1, ...terminData };

    try {
      const response = await fetch('http://localhost:8080/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTermin),
      });

      if (!response.ok) {
        throw new Error('Failed to save the termin.');
      }

      setData((prevData) => [     
        ...prevData, 
        newTermin
      ]);
      setError(''); 
      setModalVisible(false);

    } catch (err) {
      setError('Failed to save the termin.');
      console.error('Error saving termin:', err);
    }
  };


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

  const deleteTerminHandler = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the termin.');
      }

      setData((prevData) => prevData.filter((termin) => termin.id !== id));
    } catch (err) {
      setError('Failed to delete the termin.');
      console.error('Error deleting termin:', err);
    }
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