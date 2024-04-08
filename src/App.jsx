import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { useState, useRef, useEffect } from "react";

import { nanoid } from "nanoid";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}



const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);


export default function App(props) {

  const geoFindMe = () => { 
    if (!navigator.geolocation) { 
      console.log("Geolocation is not supported by your browser"); 
    } else { 
      console.log("Locating…"); 
      navigator.geolocation.getCurrentPosition(success, error); 
    } 
  }; 
 
  const success = (position) => { 
    const latitude = position.coords.latitude; 
    const longitude = position.coords.longitude; 
    console.log(latitude, longitude); 
 
    console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`); 
    console.log(`Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`); 
    locateTask(lastInsertedId, { 
      latitude: latitude, 
      longitude: longitude, 
      error: "", 
    }); 
  }; 
 
  const error = () => { 
    console.log("Unable to retrieve your location"); 
  };





  function usePersistedState(key, defaultValue) {
    const [state, setState] = useState(
      () => JSON.parse(localStorage.getItem(key)) || defaultValue);
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }

  const [tasks, setTasks] = usePersistedState("tasks", []); 
  const [filter, setFilter] = useState("All");

  function addTask(name) {
      const newTask = { 
      id: `todo-${nanoid()}`, 
      name: name, 
      completed: false, 
    };
      setTasks([...tasks, newTask]);

  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {     
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
   
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    
  }
  
  
  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  
  const [isEditing, setEditing] = useState(false);
  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
   
  }

 
  
  
 
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>

  );
}

;