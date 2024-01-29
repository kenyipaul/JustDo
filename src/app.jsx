import "./app.css"
import { useEffect } from "react"
import { useState } from 'react'

export default function App() {

    const [currentTab, setCurrentTab] = useState(0)
    const [response, setResponse] = useState([])
    const [updated, setUpdated] = useState(0)
    const [completedResponse, setCompletedResponse] = useState([])

    useEffect(() => {

        let storedTasks = localStorage.getItem('__storedTasks')

        if (storedTasks == null) {
            storedTasks = []
        } else {
            storedTasks = JSON.parse(storedTasks)
        }

        let completedTasks = storedTasks.filter(data => data.state == "completed")
        let pendingTasks = storedTasks.filter(data => data.state == "pending")

        setResponse(pendingTasks)
        setCompletedResponse(completedTasks)

    }, [updated, setUpdated])


    const addTask = () => {

        let task = document.getElementById('task').value
        let storedTasks = localStorage.getItem('__storedTasks')

        if (task !== "") {
            let newTask = { id: new Date().toLocaleString(), task: task, state: 'pending' }

            if (storedTasks == null) {
                storedTasks = []
            } else {
                storedTasks = JSON.parse(storedTasks)
            }

            storedTasks.push(newTask)
            localStorage.setItem('__storedTasks', JSON.stringify(storedTasks))

            setUpdated(updated + 1)
            document.getElementById('task').value = ''
        } else {
            alert('Please input a task below')
        }
    }

    const changeStatus = (id, state) => {
        let storedTasks = JSON.parse(localStorage.getItem('__storedTasks'))

        let modified = storedTasks.filter(data => { 
            if (data.id == id) {
                data.state = "completed"
            }
            return data
        })
        
        localStorage.setItem('__storedTasks', JSON.stringify(modified))
        
        setUpdated(updated + 1)
    }

    const deleteTask = (id) => {
        
        let storedTasks = JSON.parse(localStorage.getItem('__storedTasks'))
        
        let modified = storedTasks.filter(data => { 
            if (data.id !== id) {
                return data
            }
        })
        
        localStorage.setItem('__storedTasks', JSON.stringify(modified))
        
        setUpdated(updated + 1)
    }
    
    const clearAll = () => {
        
        let storedTasks = JSON.parse(localStorage.getItem('__storedTasks'))
        if (currentTab == 0) {
            storedTasks = storedTasks.filter(data => {
                if (data.state == "completed") {
                    return data
                }
            })
        } else {
            storedTasks = storedTasks.filter(data => {
                if (data.state == "pending") {
                    return data
                }
            })
        }
        
        localStorage.setItem('__storedTasks', JSON.stringify(storedTasks))
        setUpdated(updated + 1)
    }

    return (
        <div id="app">

            <header>
                <h2>TASK TRACKER</h2>
                <div className="input-area">
                    <input type="text" id="task" placeholder="What's on your mind today?" spellCheck={false} />
                    <button onClick={addTask}>ADD</button>
                </div>
                <div className="tabs">
                    <button className={currentTab == 0 ? 'active' : ''} onClick={() => setCurrentTab(0)}>PENDING TASKS ({response.length})</button>
                    <button className={currentTab == 1 ? 'active' : ''} onClick={() => setCurrentTab(1)}>COMPLETED TASKS ({completedResponse.length})</button>
                </div>
                <h3>You have {currentTab == 0 ? `${response.length } pending` : `${completedResponse.length} completed`} tasks</h3>
            </header>

            <main>
                {
                currentTab == 0 ?
                <ul className="pending-tasks">
                    {
                        response.map((data, key) => {
                            return (
                                <li key={key}> <div onClick={() => changeStatus(data.id)} className="checkbox"></div> {data.task} <div onClick={() => deleteTask(data.id)} className="delete"><Delete /></div> </li>
                            )
                        })
                    }
                </ul>
                :
                <ul className="completed-tasks">
                    {
                        completedResponse.map((data, key) => {
                            return (
                                <li key={key}> {data.task} <div onClick={() => deleteTask(data.id)} className="delete"><Delete /></div></li>
                            )
                        })
                    }
                </ul>
                }
            </main>

            <button onClick={clearAll} className="clearAll">CLEAR ALL</button>

        </div>
    )
}


function Delete() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 27">
            <path id="Icon_material-delete-forever" fill="#fff" data-name="Icon material-delete-forever" d="M9,28.5a3.009,3.009,0,0,0,3,3H24a3.009,3.009,0,0,0,3-3v-18H9Zm3.69-10.68L14.805,15.7,18,18.885l3.18-3.18L23.3,17.82,20.115,21l3.18,3.18L21.18,26.3,18,23.115,14.82,26.3,12.7,24.18,15.885,21ZM23.25,6l-1.5-1.5h-7.5L12.75,6H7.5V9h21V6Z" transform="translate(-7.5 -4.5)"/>
        </svg>
    )
}