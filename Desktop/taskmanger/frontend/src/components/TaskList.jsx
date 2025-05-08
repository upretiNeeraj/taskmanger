import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, deleteTask } from '../services/taskService';
import TaskItem from './TaskItem';
import '../styles/TaskList.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [sortOption, setSortOption] = useState('dueDate');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await getTasks(sortOption);
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [sortOption]);

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    if (loading) return <div>Loading tasks...</div>;

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <h2>My Tasks</h2>
                <div className="task-list-controls">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="sort-select"
                    >
                        <option value="dueDate">Sort by Due Date</option>
                        <option value="priority">Sort by Priority</option>
                    </select>
                    <button
                        onClick={() => navigate('/tasks/new')}
                        className="add-task-btn"
                    >
                        Add Task
                    </button>
                </div>
            </div>

            <div className="task-list">
                {tasks.length === 0 ? (
                    <p>No tasks found. Create your first task!</p>
                ) : (
                    tasks.map(task => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskList;