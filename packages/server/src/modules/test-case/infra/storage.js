const { MarkdownFileStorage } = require('./file-storage');
const config = require('../../../config');

class StorageFactory {
  static createStorage() {
    return new MarkdownFileStorage({ storageFolderPath: config.storage.file.path });
  }
}

module.exports = { StorageFactory };

/** @import {PaginationDTOType, TestCaseDTO} from 'just-test-cases' */
/** @import {PageCursor} from '../../../shared/pagination'; */

/**
 * @typedef {{
 *   createProject: (project: String) => Promise<void>;
 *   getProjects: (project: String) => Promise<String[]>;
 *   getByProject: (project: String, pageCursor: PageCursor) => Promise<PaginationDTOType<TestCaseDTO[]>>;
 *   saveTestCase: (project: String, data: TestCaseDTO) => Promise<void>;
 *   removeTestCase: (project: String, testCaseID: String) => Promise<void>;
 * }} StorageInterfaceType
 */
