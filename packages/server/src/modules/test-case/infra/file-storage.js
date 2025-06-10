const { NotFoundError } = require('../../../shared/errors');
const { Pagination } = require('../../../shared/pagination');
const { TestCaseMapper } = require('../mappers/test-case.mapper');
const fsp = require('fs/promises');

const path = require('node:path');

/** @implements {StorageInterfaceType} */
class MarkdownFileStorage {
  /** @typedef {FileStoragePropsType} */
  #props;

  /** @param {FileStoragePropsType} props */
  constructor(props) {
    this.#props = props;
  }

  /** @param {String} project */
  async createProject(project) {
    return fsp.mkdir(this.#getProjectPath(project));
  }

  async getProjects() {
    const entries = await fsp.readdir(this.#props.storageFolderPath, { withFileTypes: true });
    const directories = entries.filter(entry => entry.isDirectory());
    return directories.map(directory => directory.name);
  }

  /**
   * @param {String} project
   * @param {PageCursor} pageCursor
   */
  async getByProject(project, pageCursor) {
    await this.#exists(this.#getProjectPath(project), `Project ${project}.`);

    const entries = await fsp.readdir(this.#getProjectPath(project), { withFileTypes: true });
    const files = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('md'))
      .map(entry => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const pagination = new Pagination({ pageCursor, total: files.length });
    const paginatedFiles = files.slice(...pagination.range);

    const promises = paginatedFiles.map(file => fsp.readFile(this.#getFilePath(project, file), 'utf-8'));
    const contents = await Promise.all(promises);
    const items = contents.map((text, index) => TestCaseMapper.mapFromMarkdownToDTO(paginatedFiles[index], text));

    return pagination.toDTO(items);
  }

  /**
   * @param {String} id
   * @param {String} project
   */
  async removeTestCase(project, id) {
    const filePath = this.#getFilePath(project, id);
    await this.#exists(filePath, `Test case ${id} inside project ${project}.`);
    return fsp.unlink(filePath);
  }

  /**
   * @param {String} project
   * @param {TestCaseDTO} data
   */
  async saveTestCase(project, data) {
    const markdownData = TestCaseMapper.mapFromDTOToMarkdown(data);
    const fileName = data.id.endsWith('.md') ? data.id : `${data.id}.md`;
    return await fsp.writeFile(this.#getFilePath(project, fileName), markdownData, 'utf-8');
  }

  #getFilePath(project, id) {
    return path.resolve(this.#props.storageFolderPath, project, id);
  }

  #getProjectPath(project) {
    return path.resolve(this.#props.storageFolderPath, project);
  }

  /** @param {String} filePath */
  async #exists(filePath, objectName) {
    try {
      await fsp.stat(filePath);
    } catch {
      throw new NotFoundError(`Not found. ${objectName}`);
    }
  }
}

module.exports = { MarkdownFileStorage };

/** @import {StorageInterfaceType} from './storage'; */
/** @import {TestCaseDTO} from 'just-test-cases'; */
/** @import {PageCursor} from '../../../shared/pagination'; */

/** @typedef {{ storageFolderPath: String }} FileStoragePropsType */
