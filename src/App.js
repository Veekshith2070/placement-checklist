import { useEffect, useMemo, useState } from 'react'
import './App.css'

const CATEGORIES = [
  'DSA',
  'DBMS',
  'OS',
  'CN',
  'Aptitude',
  'Projects',
  'Interview',
]

const PRIORITIES = ['High', 'Medium', 'Low']

const App = () => {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const [category, setCategory] = useState('DSA')
  const [priority, setPriority] = useState('Medium')

  const [categoryFilter, setCategoryFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Load saved tasks
  useEffect(() => {
    try {
      const savedTasks = JSON.parse(
        localStorage.getItem('tasks'),
      )

      if (Array.isArray(savedTasks)) {
        setTasks(savedTasks)
      }
    } catch (error) {
      console.error('Failed to load tasks:', error)
    }
  }, [])

  // Save tasks
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (task.trim() === '') {
      return
    }

    const newTask = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
      category,
      priority,
      createdAt: new Date().toLocaleDateString(),
    }

    setTasks(prevTasks => [...prevTasks, newTask])
    setTask('')
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      addTask()
    }
  }

  const toggleTask = id => {
    setTasks(prevTasks =>
      prevTasks.map(eachTask =>
        eachTask.id === id
          ? {
              ...eachTask,
              completed: !eachTask.completed,
            }
          : eachTask,
      ),
    )
  }

  const deleteTask = id => {
    setTasks(prevTasks =>
      prevTasks.filter(eachTask => eachTask.id !== id),
    )
  }

  const clearAllTasks = () => {
    const confirmed = window.confirm(
      'Delete all placement tasks?',
    )

    if (confirmed) {
      setTasks([])
    }
  }

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    eachTask => eachTask.completed,
  ).length

  const pendingTasks = totalTasks - completedTasks

  const overallProgress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100)

  // Category progress
  const getCategoryStats = categoryName => {
    const categoryTasks = tasks.filter(
      eachTask => eachTask.category === categoryName,
    )

    const completed = categoryTasks.filter(
      eachTask => eachTask.completed,
    ).length

    const total = categoryTasks.length

    const progress =
      total === 0
        ? 0
        : Math.round((completed / total) * 100)

    return {
      total,
      completed,
      progress,
    }
  }

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(eachTask => {
      const matchesCategory =
        categoryFilter === 'All' ||
        eachTask.category === categoryFilter

      const matchesPriority =
        priorityFilter === 'All' ||
        eachTask.priority === priorityFilter

      const matchesSearch =
        eachTask.text
          .toLowerCase()
          .includes(search.toLowerCase())

      return (
        matchesCategory &&
        matchesPriority &&
        matchesSearch
      )
    })
  }, [
    tasks,
    categoryFilter,
    priorityFilter,
    search,
  ])

  const activeFilters =
    categoryFilter !== 'All' ||
    priorityFilter !== 'All' ||
    search !== ''

  return (
    <div className="app">

      {/* Header */}

      <header className="app-header">

        <div>
          <p className="header-label">
            PLACEMENT PREPARATION
          </p>

          <h1>Placement Dashboard</h1>

          <p className="header-subtitle">
            Organize your preparation. Track your progress.
            Stay interview-ready.
          </p>
        </div>

        <div className="overall-score">
          <div className="score-circle">
            <span>{overallProgress}%</span>
          </div>

          <div>
            <p>Overall Progress</p>
            <small>
              {completedTasks} of {totalTasks} completed
            </small>
          </div>
        </div>

      </header>


      <main className="dashboard">

        {/* Statistics */}

        <section className="stats-grid">

          <div className="stat-card">
            <span className="stat-icon blue">📋</span>

            <div>
              <span>Total Tasks</span>
              <strong>{totalTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon green">✓</span>

            <div>
              <span>Completed</span>
              <strong>{completedTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon orange">◷</span>

            <div>
              <span>Pending</span>
              <strong>{pendingTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon purple">⚡</span>

            <div>
              <span>Completion</span>
              <strong>{overallProgress}%</strong>
            </div>
          </div>

        </section>


        {/* Overall Progress */}

        <section className="dashboard-card">

          <div className="section-title-row">

            <div>
              <p className="section-label">
                YOUR PROGRESS
              </p>

              <h2>Overall Preparation</h2>
            </div>

            <span className="progress-number">
              {overallProgress}%
            </span>

          </div>

          <div className="progress-track large">
            <div
              className="progress-fill"
              style={{
                width: `${overallProgress}%`,
              }}
            />
          </div>

        </section>


        {/* Category Progress */}

        <section>

          <div className="section-heading">

            <div>
              <p className="section-label">
                PREPARATION AREAS
              </p>

              <h2>Category Progress</h2>
            </div>

          </div>


          <div className="category-grid">

            {CATEGORIES.map(categoryName => {
              const stats =
                getCategoryStats(categoryName)

              return (
                <button
                  type="button"
                  className={`category-card ${
                    categoryFilter === categoryName
                      ? 'selected'
                      : ''
                  }`}
                  key={categoryName}
                  onClick={() => {
                    setCategoryFilter(
                      categoryFilter === categoryName
                        ? 'All'
                        : categoryName,
                    )
                  }}
                >

                  <div className="category-top">

                    <div className="category-name">
                      {categoryName}
                    </div>

                    <strong>
                      {stats.progress}%
                    </strong>

                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${stats.progress}%`,
                      }}
                    />
                  </div>

                  <p>
                    {stats.completed} / {stats.total}{' '}
                    completed
                  </p>

                </button>
              )
            })}

          </div>

        </section>


        {/* Add Task */}

        <section className="dashboard-card add-task-card">

          <div className="section-title-row">

            <div>
              <p className="section-label">
                KEEP MOVING
              </p>

              <h2>Add a Preparation Task</h2>
            </div>

          </div>


          <div className="task-form">

            <input
              type="text"
              value={task}
              placeholder="e.g. Revise DBMS normalization"
              onChange={event =>
                setTask(event.target.value)
              }
              onKeyDown={handleKeyDown}
              className="task-input"
            />

            <select
              value={category}
              onChange={event =>
                setCategory(event.target.value)
              }
            >
              {CATEGORIES.map(eachCategory => (
                <option
                  key={eachCategory}
                  value={eachCategory}
                >
                  {eachCategory}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={event =>
                setPriority(event.target.value)
              }
            >
              {PRIORITIES.map(eachPriority => (
                <option
                  key={eachPriority}
                  value={eachPriority}
                >
                  {eachPriority}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="add-button"
              onClick={addTask}
            >
              + Add Task
            </button>

          </div>

          <p className="form-hint">
            Press Enter to quickly add a task.
          </p>

        </section>


        {/* Tasks */}

        <section className="tasks-section">

          <div className="tasks-header">

            <div>
              <p className="section-label">
                TASKS
              </p>

              <h2>
                {activeFilters
                  ? 'Filtered Tasks'
                  : 'Your Preparation Tasks'}
              </h2>
            </div>

            {tasks.length > 0 && (
              <button
                type="button"
                className="clear-button"
                onClick={clearAllTasks}
              >
                Clear All
              </button>
            )}

          </div>


          {/* Filters */}

          <div className="filters">

            <div className="search-wrapper">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={event =>
                  setSearch(event.target.value)
                }
              />

            </div>


            <select
              value={categoryFilter}
              onChange={event =>
                setCategoryFilter(event.target.value)
              }
            >
              <option value="All">
                All Categories
              </option>

              {CATEGORIES.map(eachCategory => (
                <option
                  key={eachCategory}
                  value={eachCategory}
                >
                  {eachCategory}
                </option>
              ))}
            </select>


            <select
              value={priorityFilter}
              onChange={event =>
                setPriorityFilter(event.target.value)
              }
            >
              <option value="All">
                All Priorities
              </option>

              {PRIORITIES.map(eachPriority => (
                <option
                  key={eachPriority}
                  value={eachPriority}
                >
                  {eachPriority}
                </option>
              ))}
            </select>

          </div>


          {/* Task List */}

          {filteredTasks.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                {tasks.length === 0 ? '✓' : '⌕'}
              </div>

              <h3>
                {tasks.length === 0
                  ? 'No tasks yet'
                  : 'No matching tasks'}
              </h3>

              <p>
                {tasks.length === 0
                  ? 'Add your first placement preparation task above.'
                  : 'Try changing your filters or search term.'}
              </p>

            </div>

          ) : (

            <div className="task-list">

              {filteredTasks.map(eachTask => (

                <article
                  key={eachTask.id}
                  className={`task-card ${
                    eachTask.completed
                      ? 'task-completed'
                      : ''
                  }`}
                >

                  <label className="checkbox-wrapper">

                    <input
                      type="checkbox"
                      checked={eachTask.completed}
                      onChange={() =>
                        toggleTask(eachTask.id)
                      }
                    />

                    <span className="custom-checkbox">
                      {eachTask.completed ? '✓' : ''}
                    </span>

                  </label>


                  <div className="task-content">

                    <h3>
                      {eachTask.text}
                    </h3>

                    <div className="task-meta">

                      <span className="category-badge">
                        {eachTask.category}
                      </span>

                      <span
                        className={`priority-badge ${eachTask.priority.toLowerCase()}`}
                      >
                        {eachTask.priority}
                      </span>

                      <span className="task-date">
                        Added {eachTask.createdAt}
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      deleteTask(eachTask.id)
                    }
                    aria-label={`Delete ${eachTask.text}`}
                  >
                    ×
                  </button>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>


      <footer className="app-footer">
        <p>
          Built with React · Your placement preparation,
          one task at a time.
        </p>
      </footer>

    </div>
  )
}

export default App
