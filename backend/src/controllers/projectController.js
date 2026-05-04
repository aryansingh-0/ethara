import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id }).populate('members', 'name userCredentials.email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { projectId, email } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Only Admin can add members in this task manager, wait, or project creator? Let's say only admin.
    // the route will be protected by `admin` middleware
    
    const user = await User.findOne({ 'userCredentials.email': email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'User already in project' });
    }

    project.members.push(user._id);
    await project.save();
    
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name userCredentials.email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
