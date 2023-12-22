import { useState, useEffect} from 'react';
import './App.css';
import Task from './components/Task.jsx';
import EditTask from './components/EditTask.jsx';

function App() {
  let [tasks,setTasks] = useState(()=>{
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  let [value,setValue] = useState('');
  
  useEffect(() => {
      localStorage.setItem("tasks",JSON.stringify(tasks));
  },[tasks]);

  const handleSubmit = e =>{
    e.preventDefault();

    if(value!==''){
      addTask();
    }
  
  }

  function addTask(){
    setTasks([{
        "id": Date.now(),
        "title": value,
        "completed": false,
        "isEditing":false}
        ,...tasks
    ]);

    setValue('');
  }

  function isEditing(taskId){
    setTasks( tasks.map(task => task.id === taskId ? {...task, isEditing:true} : {...task,isEditing:false } ) );
  }

  function updateTask(taskId,value){
    setTasks( tasks.map(task => task.id === taskId ? {...task, title:value , isEditing:false} : task ) );
  }

  function toggleTask(taskId){
    setTasks((prevTasks)=>{ 
      const updatedTasks = prevTasks.map( (task) =>  
        task.id === taskId ? {...task , completed: !task.completed } : task 
      );

      const completedTasks = updatedTasks.filter( (task)=> task.completed );
      const incompletedTasks = updatedTasks.filter( (task)=> !task.completed );
       
      return[...incompletedTasks, ...completedTasks];
    });
  }

  function deleteTask(taskId){
    const newTasks = tasks.filter(function (task) {
        return task.id !== Number(taskId);
    });
    setTasks(newTasks);
  }

  return (
    <div className="App">

      <h1>Todo List App</h1>
      <div id="container">
        <form onSubmit={handleSubmit}>
          <input placeholder="What is the task ?" className="add-task" id="add" value={value} onChange={(e)=> setValue(e.target.value)}/>
          <button className='add' type='submit'>Add</button>
        </form>
        <span id="total-tasks">Total tasks: <span id="tasks-counter">{tasks.length}</span></span>
        <ul id="list">
          { 
            tasks.map( (task) => (
              task.isEditing ?
              <EditTask key={task.id} task={task} update={updateTask} />
              :
              <Task key={task.id} task={task} deleteTask={deleteTask} toggleTask={toggleTask} isEditing={isEditing} />
            ))
          }
        </ul>
      </div>
      
    </div>
  );
}

export default App;
