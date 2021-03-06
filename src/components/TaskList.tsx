import { useEffect, useState } from 'react'

import '../styles/tasklist.scss'

import { FiTrash, FiCheckSquare } from 'react-icons/fi'

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const [id, setId] = useState(0);

  useEffect(() => {
    const tasks = localStorage.getItem('tasks');

    if (!tasks) {
      return
    }

    setTasks(JSON.parse(tasks));
    
    setId(JSON.parse(tasks).length);
  }, []);

  function handleCreateNewTask() {
    setId(id + 1);

    const newTask = {
      id: id,
      title: newTaskTitle,
      isComplete: false
    };

    if (newTaskTitle === '') {
      return;
    }

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  }

  function handleToggleTaskCompletion(id: number) {
    setTasks(
      tasks.map(task =>
        task.id === id && task.isComplete === false
          ? { ...task, isComplete: true }
          : task.id === id && task.isComplete === true ? { ...task, isComplete: false }
            : task
      ))
  }

  function handleRemoveTask(id: number) {
    setTasks(tasks.filter(task => {
      return task.id !== id;
    }));
  }

  useEffect(() => {
    localStorage.removeItem('tasks');

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks])

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo todo"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                handleCreateNewTask();
              }
            }}
          />
          <button 
            type="submit" 
            data-testid="add-task-button" 
            onClick={handleCreateNewTask} 
            onKeyDown={handleCreateNewTask}
          >
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button
                type="button"
                data-testid="remove-task-button"
                onClick={() => {
                  handleRemoveTask(task.id);
                }}
              >
                <FiTrash size={16} />
              </button>
            </li>
          ))}

        </ul>
      </main>
    </section>
  )
}