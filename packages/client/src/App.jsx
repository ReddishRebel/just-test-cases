import { createProject, deleteTestCase, getProjects, saveTestCase } from './services/api';
import { useEffect, useState } from 'react';
import FlowTesting from './components/FlowTesting';
import ProjectForm from './components/ProjectForm';
import Sidebar from './components/Sidebar';
import TestCaseForm from './components/TestCaseForm';
import TestCaseList from './components/TestCaseList';

import { logger } from './tools/logger';

const APP_VIEWS = Object.freeze({
  LIST: 'list',
  FLOW: 'flow',
  FORM: 'form',
  REPORT: 'report',
  PROJECT_FORM: 'project-form'
});

function App() {
  /** @type {[string[], Function]} */
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  /** @type {[APP_VIEWS[keyof APP_VIEWS], Function]} */
  const [view, setView] = useState(APP_VIEWS.LIST);
  /** @type {[TestCaseDTO | null, Function]} */
  const [editCase, setEditCase] = useState(null);

  const fetchProjects = () => {
    getProjects()
      .then(projects => setProjects(projects))
      .catch(error => logger.error('Failed to load projects list.', error));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectSelect = projectID => {
    setSelectedProject(projectID);
    setView(APP_VIEWS.LIST);
    setEditCase(null);
  };

  const handleFlowExit = () => {
    setView(APP_VIEWS.LIST);
  };

  return (
    <div style={styles.wrapper}>
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        handleSelect={handleProjectSelect}
        handleCreate={() => {
          setView(APP_VIEWS.PROJECT_FORM);
        }}
      />

      <main style={styles.main}>
        {!selectedProject && <p style={{ padding: '2rem' }}>Choose project to start working.</p>}

        {selectedProject && view === APP_VIEWS.LIST && (
          <TestCaseList
            project={selectedProject}
            handleTestCaseEdit={testCase => {
              setEditCase(testCase);
              setView(APP_VIEWS.FORM);
            }}
            handleStart={() => setView(APP_VIEWS.FLOW)}
            handleTestCaseDelete={id => {
              deleteTestCase(selectedProject, id).catch(error => {
                logger.error('Cannot delete test case.', error);
              });
              setView(APP_VIEWS.LIST);
            }}
            handleCreate={() => setView(APP_VIEWS.FORM)}
          />
        )}

        {selectedProject && view !== APP_VIEWS.LIST && view === APP_VIEWS.FLOW && (
          <FlowTesting project={selectedProject} handleExit={handleFlowExit} />
        )}

        {selectedProject && view !== APP_VIEWS.LIST && view === APP_VIEWS.FORM && (
          <TestCaseForm
            initialData={editCase ?? {}}
            handleSubmit={testCase => {
              if (selectedProject) {
                saveTestCase(selectedProject, testCase).catch(error => {
                  logger.error('Cannot save test case.', error);
                });
                setEditCase(null);
                setView(APP_VIEWS.LIST);
              }
            }}
            handleCancel={() => {
              setEditCase(null);
              setView(APP_VIEWS.LIST);
            }}
          />
        )}

        {view !== APP_VIEWS.LIST && view === APP_VIEWS.PROJECT_FORM && (
          <ProjectForm
            handleSubmit={data => {
              createProject(data.name).catch(error => {
                logger.error('Cannot create project.', error);
              });
              setView(APP_VIEWS.LIST);
              fetchProjects();
            }}
            handleCancel={() => {
              setView(APP_VIEWS.LIST);
            }}
          />
        )}
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'sans-serif'
  },
  main: Object.freeze({
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#f8f9fa'
  })
};

export default App;

/** @import {TestCaseDTO} from 'just-test-cases'; */
