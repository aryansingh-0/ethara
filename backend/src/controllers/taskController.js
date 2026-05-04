import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      dueDate
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name userCredentials.email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    task.status = status;
    await task.save();
    
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    // Get all projects the user is a member of
    const userProjects = await Project.find({ members: req.user._id });
    const projectIds = userProjects.map(p => p._id);
    
    // Find all tasks that belong to those projects
    const tasks = await Task.find({ project: { $in: projectIds } }).populate('project', 'name');
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
