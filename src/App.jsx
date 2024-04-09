import React, { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
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
  const listHeadingRef = useRef(null);

  const geoFindMe = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      console.log("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  useEffect(() => {
    if (tasks.length === 0) {
      geoFindMe();
    }
  }, []);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);

    console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
    console.log(
      `Try it here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
    );
    console.log("Adding task with latitude:", latitude, "and longitude:", longitude);

    addTask(name, latitude, longitude); 
  };

  const error = () => {
    console.log("Unable to retrieve your location");
  };

  function usePersistedState(key, defaultValue) {
    const [state, setState] = useState(() => JSON.parse(localStorage.getItem(key)) || defaultValue);
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }

  const [tasks, setTasks] = usePersistedState("tasks", []);
  const [filter, setFilter] = useState("All");
  const [lastInsertedId, setLastInsertedId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    locateTask(lastInsertedId, {
      latitude: latitude,
      longitude: longitude,
      error: "",
      mapURL: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
      smsURL: `sms://00447700900xxxx?body=https://maps.google.com/?q=${latitude},${longitude}`,
    });
  }, [latitude, longitude]);

  function addTask(name, latitude, longitude) {
    if (latitude && longitude) {
      const id = "todo-" + nanoid();
      const newTask = {
        id: id,
        name: name,
        completed: false,
        location: { latitude: latitude, longitude: longitude, error: "" },
      };
      setLastInsertedId(id);
      setTasks([...tasks, newTask]);
    } else {
      console.log("Invalid latitude or longitude");
    }
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

  function locateTask(id, location) {
    const locatedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, location: { ...task.location, ...location } };
      }
      return task;
    });
    setTasks(locatedTaskList);
  }

  function photoedTask(id) {
    console.log("photoedTask", id);
    const photoedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, photo: true };
      }
      return task;
    });
    console.log(photoedTaskList);
    setTasks(photoedTaskList);
  }



  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => {
      if (!task.location) {
        return null;
      }
      return (
        <Todo
          id={task.id}
          name={task.name}
          completed={task.completed}
          key={task.id}
          location={task.location}
          toggleTaskCompleted={toggleTaskCompleted}
          photoedTask={photoedTask}
          deleteTask={deleteTask}
        
        />
      );
    })
    .filter((task) => task !== null);

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton key={name} name={name} isPressed={name === filter} setFilter={setFilter} />
  ));

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} geoFindMe={geoFindMe} />

      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul role="list" className="todo-list stack-large stack-exception" aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}
