import React from 'react'
import api from '../api/axios'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
const CreateTask = () => {
    const nav=useNavigate();
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
    });

    const createTask = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/tasks', taskData);   
            console.log('Task created:', response.data);
            alert('Task created successfully!');
            nav("/home");

        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task.');
        }
    };
  return (
    <>
    <h2>Create Task</h2>
    <form onSubmit={createTask}>
        <div>
            <label>Title:</label>
            <input
                type="text"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
            />
        </div>
        <div>
            <label>Description:</label>
            <input
                type="text"
                value={taskData.description}
                onChange={(e) => setTaskData({...taskData, description: e.target.value})}
            />
        </div>
        <button type="submit">Create Task</button>
    </form> 
    </>
  )
}

export default CreateTask
