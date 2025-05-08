import { useNavigate } from 'react-router-dom';
import '../styles/TaskItem.css';

const TaskItem = ({ task, onDelete }) => {
    const navigate = useNavigate();
    const dueDate = new Date(task.dueDate).toLocaleDateString();

    const getPriorityClass = () => {
        switch (task.priority) {
            case 'High': return 'priority-high';
            case 'Medium': return 'priority-medium';
            case 'Low': return 'priority-low';
            default: return '';
        }
    };

    return (
        <div className={`task-item ${getPriorityClass()}`}>
            <div className="task-content">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                    <span>Due: {dueDate}</span>
                    <span>Status: {task.status}</span>
                </div>
            </div>
            <div className="task-actions">
                <button onClick={() => navigate(`/tasks/${task._id}`)}>Edit</button>
                <button onClick={() => onDelete(task._id)}>Delete</button>
            </div>
        </div>
    );
};

export default TaskItem;