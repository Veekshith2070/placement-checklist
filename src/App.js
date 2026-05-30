import {useState, useEffect} from 'react'
import './App.css'

const App = () => {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const [category, setCategory] = useState('DSA')
  const [priority, setPriority] = useState('Medium')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const savedTasks = JSON.parse(
      localStorage.getItem('tasks'),
    )

    if (savedTasks) {
      setTasks(savedTasks)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'tasks',
      JSON.stringify(tasks),
    )
  }, [tasks])

  const addTask = () => {
    if (task.trim() === '') {
      return
    }

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
      category,
      priority,
      createdAt: new Date().toLocaleDateString(),
    }

    setTasks([...tasks, newTask])
    setTask('')
  }

  const toggleTask = id => {
    const updatedTasks = tasks.map(eachTask => {
      if (eachTask.id === id) {
        return {
          ...eachTask,
          completed: !eachTask.completed,
        }
      }

      return eachTask
    })

    setTasks(updatedTasks)
  }

  const deleteTask = id => {
    const updatedTasks = tasks.filter(
      eachTask => eachTask.id !== id,
    )

    setTasks(updatedTasks)
  }

  const clearAllTasks = () => {
    const confirmed = window.confirm(
      'Delete all tasks?'
    )

    if (confirmed) {
      setTasks([])
    }
  }

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    eachTask => eachTask.completed,
  ).length

  const pendingTasks =
    totalTasks - completedTasks

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100,
        )

  const filteredTasks =
    filter === 'All'
      ? tasks
      : tasks.filter(
          eachTask =>
            eachTask.category === filter,
        )

  return (
    <div className="container">
      <h1 className="heading">
        Placement Checklist
      </h1>

      <div className="stats-container">
        <p>Total Tasks: {totalTasks}</p>
        <p>
          Completed Tasks:{' '}
          {completedTasks}
        </p>
        <p>Pending Tasks: {pendingTasks}</p>
        <p>Progress: {progress}%</p>
      </div>

      <div className="input-container">
        <input
          type="text"
          value={task}
          placeholder="Enter a task"
          onChange={e =>
            setTask(e.target.value)
          }
          onKeyDown={e => {
            if (e.key === 'Enter') {
              addTask()
            }
          }}
          className="task-input"
        />

        <select
          value={category}
          onChange={e =>
            setCategory(e.target.value)
          }
        >
          <option>DSA</option>
          <option>React</option>
          <option>Core</option>
          <option>Aptitude</option>
          <option>Applications</option>
        </select>

        <select
          value={priority}
          onChange={e =>
            setPriority(e.target.value)
          }
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button
          type="button"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <div className="filter-container">
        <label>Filter:</label>

        <select
          value={filter}
          onChange={e =>
            setFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>DSA</option>
          <option>React</option>
          <option>Core</option>
          <option>Aptitude</option>
          <option>Applications</option>
        </select>
      </div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li
            key={task.id}
            className="task-item"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                toggleTask(task.id)
              }
            />

            <div className="task-details">
              <p
                className={
                  task.completed
                    ? 'completed-task'
                    : ''
                }
              >
                [{task.category}] {task.text}
              </p>

              <small>
                Priority: {task.priority}
              </small>

              <br />

              <small>
                Created: {task.createdAt}
              </small>
            </div>

            <button
              type="button"
              className="delete-btn"
              onClick={() =>
                deleteTask(task.id)
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <button
          type="button"
          className="clear-btn"
          onClick={clearAllTasks}
        >
          Clear All
        </button>
      )}
    </div>
  )
}

export default App