const { ApplicationError } = require('../../../shared/errors');
const { Cursor } = require('../../../shared/cursor');

const MARKDOWN_LIST_REGEX = /^(\s*)(\d+)\.\s+(.+)/;

class TestCaseMapper {
  /** @param {TestCaseDTO} data */
  static mapFromDTOToMarkdown(data) {
    const rows = [
      `# ${data.title}`,
      `## Priority`,
      data.priority,
      `## Description`,
      data.description || '-',
      `## Preconditions`,
      TestCaseMapper.#mapCollectionToMarkdown(data.preconditions) || '-',
      `## Steps`,
      TestCaseMapper.#mapCollectionToMarkdown(data.steps) || '-',
      `## Results`,
      TestCaseMapper.#mapCollectionToMarkdown(data.results) || '-'
    ];

    return rows.join('\n\n').trim();
  }

  /**
   * @param {String} id
   * @param {String} data
   * @returns {TestCaseDTO}
   */
  static mapFromMarkdownToDTO(id, data) {
    const sections = data.trim().split(data.includes('\r\n') ? '\r\n\r\n' : '\n\n');
    if (sections.length < 11) {
      throw new ApplicationError(
        'Invalid markdown data. Must have all 6 sections including: id, priority, description, preconditions, steps and results. All sections must include content of at least -.'
      );
    }

    return {
      id,
      title: sections[0].replace('#', '').trim(),
      description: sections[4].trim(),
      priority: sections[2].trim(),
      preconditions: TestCaseMapper.#mapMarkdownRecursiveList(sections[6].trim().split('\n')),
      steps: TestCaseMapper.#mapMarkdownRecursiveList(sections[8].trim().split('\n')),
      results: TestCaseMapper.#mapMarkdownRecursiveList(sections[10].trim().split('\n'))
    };
  }

  /** @param {RecursiveStringArray} collection */
  static #mapCollectionToMarkdown(collection, depth = 0) {
    const rows = [];

    for (let i = 0; i < collection.length; i++) {
      const item = collection[i];
      if (typeof item === 'string') {
        rows.push(`${'  '.repeat(depth)}${i + 1}. ${collection[i]}`);
      } else {
        rows.push(TestCaseMapper.#mapCollectionToMarkdown(item, depth + 1));
      }
    }

    return rows.join('\n');
  }

  /** @param {String[]} lines */
  static #mapMarkdownRecursiveList(lines, depth = 0, cursor = new Cursor()) {
    const elements = [];
    const spacer = '  '.repeat(depth);

    for (; cursor.isLessThan(lines.length); cursor.increment()) {
      const line = lines[cursor.index];
      const match = MARKDOWN_LIST_REGEX.exec(line);
      if (match !== null) {
        if (match[1].length === spacer.length) {
          elements.push(match[3]);
        } else if (match[1].length > spacer.length) {
          elements.push(TestCaseMapper.#mapMarkdownRecursiveList(lines, depth + 1, cursor));
        } else if (match[1].length < spacer.length) {
          break;
        }
      }
    }
    return elements;
  }
}

module.exports = {
  TestCaseMapper
};

/** @import {TestCaseDTO, RecursiveStringArray} from 'just-test-cases'; */
