import { request } from '../tools/network';

/** @param {String} projectName */
export async function createProject(projectName) {
  await request(
    '/projects',
    'POST',
    JSON.stringify({ name: projectName }),
    { 'Content-Type': 'application/json' },
    false
  );
}

/** @returns {Promise<string[]>} */
export async function getProjects() {
  const data = await request('/projects', 'GET', null, {}, true);
  return data.projects;
}

/**
 * @param {string} projectID
 * @param {number} [page=1] Default is `1`
 * @returns {Promise<PaginationDTOType<TestCaseDTO[]>>}
 */
export async function getTestCases(projectID, page = 1) {
  const data = await request(`/projects/${projectID}/cases?page=${page}`, 'GET', null, {}, true);
  return data;
}

/**
 * @param {string} projectID
 * @param {TestCaseDTO} testCase
 * @returns {Promise<void>}
 */
export async function saveTestCase(projectID, testCase) {
  await request(
    `/projects/${projectID}/cases`,
    'PUT',
    JSON.stringify(testCase),
    { 'Content-Type': 'application/json' },
    false
  );
}

/**
 * @param {string} projectID
 * @param {string} caseID
 * @returns {Promise<void>}
 */
export async function deleteTestCase(projectID, caseID) {
  await request(`/projects/${projectID}/cases/${caseID}`, 'DELETE', null, {}, false);
}

/** @import {PaginationDTOType, TestCaseDTO} from 'just-test-cases'; */
