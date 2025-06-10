const DEFAULT_ITEMS_PER_PAGE = 10;

class PageCursor {
  /** @type {PageCursorPropsType} */
  #props;

  get page() {
    return this.#props.page;
  }

  get itemsPerPage() {
    return this.#props.itemsPerPage;
  }

  /** @param {PageCursorPropsType} props */
  constructor(props) {
    const page = Math.max(1, Math.floor(props.page ?? 1));
    const itemsPerPage = Math.max(1, Math.floor(props.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE));

    this.#props = { page, itemsPerPage };
  }
}

class Pagination {
  /** @type {PaginationPropsType} */
  #props;

  get total() {
    return this.#props.total;
  }

  get itemsPerPage() {
    return this.#props.pageCursor.itemsPerPage;
  }

  get page() {
    return Math.min(this.#props.pageCursor.page, this.pages);
  }

  get pages() {
    return Math.ceil(this.#props.total / this.itemsPerPage);
  }

  get range() {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return [start, end];
  }

  /** @param {PaginationPropsType} props */
  constructor(props) {
    this.#props = props;
  }

  /**
   * @template T
   * @param {T} items
   * @returns {PaginationDTOType<T>}
   */
  toDTO(items) {
    return {
      items,
      total: this.total,
      page: this.page,
      pages: this.pages
    };
  }
}

module.exports = { Pagination, PageCursor, DEFAULT_ITEMS_PER_PAGE };

/** @import {PaginationDTOType} from 'just-test-cases'; */

/** @typedef {{ page: Number; itemsPerPage: Number }} PageCursorPropsType */
/** @typedef {{ pageCursor: PageCursor; total: Number }} PaginationPropsType */
