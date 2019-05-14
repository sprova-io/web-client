import { getProjects } from '@/api/project.api';
import { findById } from '@/utils';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Project } from 'sprova-types';

export const CURRENT_PROJECT_ID = 'currentProjectId';

interface ProjectContext {
  currentProject: Project | null;
  error: string | null;
  isProjectsFetched: boolean;
  onSelectProject: (project: Project | null) => void;
  onRemoveProject: (project: Project) => void;
  onAddProject: (project: Project) => void;
  projects: Project[];
}

const initialContext: ProjectContext = {
  currentProject: null,
  error: null,
  isProjectsFetched: false,
  onAddProject: () => {},
  onRemoveProject: () => {},
  onSelectProject: () => {},
  projects: [],
};

const ProjectContext = React.createContext<ProjectContext>(initialContext);

const ProjectProvider: React.FunctionComponent = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProjectsFetched, setIsProjectsFetched] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsProjectsFetched(false);
      setError('');

      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);

        const _currentProject = findCurrentProject(fetchedProjects);
        setCurrentProject(_currentProject);
      } catch (error) {
        setError(error);
      } finally {
        setIsProjectsFetched(true);
      }
    };

    fetchProjects();
  }, []);

  const findCurrentProject = (_projects: Project[]): Project | null => {
    if (!_projects || _projects.length === 0) {
      return null;
    }
    const firstProject = _projects[0];
    const currentProjectId = localStorage.getItem(CURRENT_PROJECT_ID);
    return currentProjectId
      ? findById(_projects, currentProjectId) || firstProject
      : firstProject;
  };

  const handleAddProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const handleRemoveProject = (project: Project) => {
    setProjects(_.without(projects, project));
  };

  const handleSelectProject = (project: Project | null) => {
    if (project) {
      localStorage.setItem(CURRENT_PROJECT_ID, project._id);
    } else {
      localStorage.removeItem(CURRENT_PROJECT_ID);
    }
    setCurrentProject(project);
  };

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        error,
        isProjectsFetched,
        onAddProject: handleAddProject,
        onRemoveProject: handleRemoveProject,
        onSelectProject: handleSelectProject,
        projects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectProvider, ProjectContext };
