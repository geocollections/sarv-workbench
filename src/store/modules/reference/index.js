import { getField, updateField } from "vuex-map-fields";

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: {
      page: 1,
      itemsPerPage: 50,
      sortBy: ["id"],
      sortDesc: [true],
    },
    viewType: "table",
    searchFields: {
      byIds: {
        abstract: {
          lookUpType: "icontains",
          title: "reference.abstractRemarks",
          value: null,
          fields: ["abstract", "remarks"],
          type: "multi",
        },
        author: {
          lookUpType: "icontains",
          title: "reference.author",
          value: null,
        },
        author_keywords: {
          lookUpType: "icontains",
          title: "reference.author_keywords",
          value: null,
        },
        author_original: {
          lookUpType: "icontains",
          title: "reference.author_original",
          value: null,
        },
        book: {
          lookUpType: "icontains",
          title: "reference.bookJournal",
          value: null,
          fields: ["book", "book_editor", "journal__journal_name"],
          type: "multi",
        },
        book_editor: {
          lookUpType: "icontains",
          title: "reference.book_editor",
          value: null,
        },
        book_original: {
          lookUpType: "icontains",
          title: "reference.book_original",
          value: null,
        },
        book_translated: {
          lookUpType: "icontains",
          title: "reference.book_translated",
          value: null,
        },
        book_translated_language: {
          lookUpType: "icontains",
          title: "reference.book_translated_language__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "reference.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "reference.date_changed",
          value: null,
        },
        doi: {
          lookUpType: "icontains",
          title: "reference.doi",
          value: null,
        },
        egf: {
          lookUpType: "icontains",
          title: "reference.egf",
          value: null,
        },
        figures: {
          lookUpType: "icontains",
          title: "reference.figures",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "reference.id",
          value: null,
        },
        is_estonian_author: {
          title: "reference.is_estonian_author",
          value: null,
          isCheckbox: true,
        },
        is_estonian_reference: {
          title: "reference.is_estonian_reference",
          value: null,
          isCheckbox: true,
        },
        is_locked: {
          title: "reference.is_locked",
          value: null,
        },
        is_oa: {
          title: "reference.is_oa",
          value: null,
        },
        is_private: {
          title: "reference.is_private",
          value: null,
        },
        isbn: {
          lookUpType: "icontains",
          title: "reference.isbn",
          value: null,
        },
        issn: {
          lookUpType: "icontains",
          title: "reference.issn",
          value: null,
        },
        journal: {
          lookUpType: "icontains",
          title: "reference.journal__id",
          value: null,
        },
        journal_additional: {
          lookUpType: "icontains",
          title: "reference.journal_additional",
          value: null,
        },
        journal_txt: {
          lookUpType: "icontains",
          title: "reference.journal_txt",
          value: null,
        },
        language: {
          lookUpType: "icontains",
          title: "reference.language__id",
          value: null,
        },
        licence: {
          lookUpType: "icontains",
          title: "reference.licence__id",
          value: null,
        },
        location_txt: {
          lookUpType: "icontains",
          title: "reference.location_txt",
          value: null,
        },
        number: {
          lookUpType: "icontains",
          title: "reference.number",
          value: null,
        },
        pages: {
          lookUpType: "icontains",
          title: "reference.pages",
          value: null,
        },
        parent_reference: {
          lookUpType: "icontains",
          title: "reference.parent_reference__id",
          value: null,
        },
        publisher: {
          lookUpType: "icontains",
          title: "reference.publisher",
          value: null,
        },
        publisher_place: {
          lookUpType: "icontains",
          title: "reference.publisher_place",
          value: null,
        },
        reference: {
          lookUpType: "icontains",
          title: "reference.reference",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "reference.remarks",
          value: null,
        },
        remarks_private: {
          lookUpType: "icontains",
          title: "reference.remarks_private",
          value: null,
        },
        tags: {
          lookUpType: "icontains",
          title: "reference.tags",
          value: null,
        },
        title: {
          lookUpType: "icontains",
          title: "reference.title",
          value: null,
          fields: ["title", "title_original"],
          type: "multi",
        },
        title_original: {
          lookUpType: "icontains",
          title: "reference.title_original",
          value: null,
        },
        title_translated: {
          lookUpType: "icontains",
          title: "reference.title_translated",
          value: null,
        },
        title_translated_language: {
          lookUpType: "icontains",
          title: "reference.title_translated_language__id",
          value: null,
        },
        translated_reference: {
          lookUpType: "icontains",
          title: "reference.translated_reference__id",
          value: null,
        },
        type: {
          lookUpType: "icontains",
          title: "reference.type__id",
          value: null,
        },
        url: {
          lookUpType: "icontains",
          title: "reference.url",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "reference.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "reference.user_changed",
          value: null,
        },
        uuid: {
          lookUpType: "icontains",
          title: "reference.uuid",
          value: null,
        },
        volume: {
          lookUpType: "icontains",
          title: "reference.volume",
          value: null,
        },
        year: {
          lookUpType: "icontains",
          title: "reference.year",
          value: null,
        },
        library: {
          lookUpType: "icontains",
          title: "reference.libraryAuthorIdTitle",
          value: null,
          fields: [
            "library_reference__library__author__agent",
            "library_reference__library__author_txt",
            "library_reference__library__title",
            "library_reference__library__title_en",
          ],
          type: "multi",
        },
        keywords: {
          lookUpType: "icontains",
          title: "reference.keywords",
          value: null,
          fields: ["reference_keyword__keyword__keyword"],
        },
      },
      mainIds: [
        "author",
        "year",
        "title",
        "book",
        "abstract",
        "keywords",
        "id",
        "library",
        "user_added",
        "is_estonian_reference",
        "is_estonian_author",
      ],
      extraIds: [
        "author_keywords",
        "author_original",
        "book_editor",
        "book_original",
        "book_translated",
        "book_translated_language",
        "date_added",
        "date_changed",
        "doi",
        "egf",
        "figures",
        "is_locked",
        "is_oa",
        "is_private",
        "isbn",
        "issn",
        "journal",
        "journal_additional",
        "journal_txt",
        "language",
        "licence",
        "location_txt",
        "number",
        "pages",
        "parent_reference",
        "publisher",
        "publisher_place",
        "reference",
        "remarks",
        "remarks_private",
        "tags",
        "title_original",
        "title_translated",
        "title_translated_language",
        "translated_reference",
        "type",
        "url",
        "user_changed",
        "uuid",
        "volume",
      ],
    },
    headers: [
      {
        value: "id",
        text: "reference.id",
        show: true,
      },
      {
        value: "author",
        text: "reference.author",
        show: true,
      },
      {
        value: "year",
        text: "reference.year",
        show: true,
      },
      {
        value: "title",
        text: "reference.title",
        show: true,
      },
      {
        value: "journal__journal_name",
        text: "reference.journal__journal_name",
        show: true,
      },
      {
        value: "volume",
        text: "reference.volume",
        show: true,
      },
      {
        value: "pages",
        text: "reference.pages",
        show: true,
      },
      {
        value: "is_estonian_reference",
        text: "reference.is_estonian_reference",
        show: true,
      },
      {
        value: "link",
        text: "reference.link",
        sortable: false,
        show: true,
      },
      {
        value: "doi",
        text: "reference.doi",
        show: true,
      },
      {
        value: "attachment__filename",
        text: "reference.attachment__filename",
        show: true,
      },
      {
        value: "url",
        text: "reference.url",
        show: true,
      },
      {
        value: "date_changed",
        text: "reference.date_changed",
        show: true,
      },
      {
        value: "reference",
        text: "reference.reference",
        show: false,
      },
      {
        value: "author_original",
        text: "reference.author_original",
        show: false,
      },
      {
        value: "type__id",
        text: "reference.type__id",
        show: false,
      },
      {
        value: "type__value",
        text: "reference.type__value",
        show: false,
      },
      {
        value: "type__value_en",
        text: "reference.type__value_en",
        show: false,
      },
      {
        value: "language__id",
        text: "reference.language__id",
        show: false,
      },
      {
        value: "language__value",
        text: "reference.language__value",
        show: false,
      },
      {
        value: "language__value_en",
        text: "reference.language__value_en",
        show: false,
      },
      {
        value: "title_original",
        text: "reference.title_original",
        show: false,
      },
      {
        value: "title_translated",
        text: "reference.title_translated",
        show: false,
      },
      {
        value: "title_translated_language__id",
        text: "reference.title_translated_language__id",
        show: false,
      },
      {
        value: "title_translated_language__value",
        text: "reference.title_translated_language__value",
        show: false,
      },
      {
        value: "title_translated_language__value_en",
        text: "reference.title_translated_language__value_en",
        show: false,
      },
      {
        value: "book",
        text: "reference.book",
        show: false,
      },
      {
        value: "book_original",
        text: "reference.book_original",
        show: false,
      },
      {
        value: "book_translated",
        text: "reference.book_translated",
        show: false,
      },
      {
        value: "book_translated_language__id",
        text: "reference.book_translated_language__id",
        show: false,
      },
      {
        value: "book_translated_language__value",
        text: "reference.book_translated_language__value",
        show: false,
      },
      {
        value: "book_translated_language__value_en",
        text: "reference.book_translated_language__value_en",
        show: false,
      },
      {
        value: "book_editor",
        text: "reference.book_editor",
        show: false,
      },
      {
        value: "publisher",
        text: "reference.publisher",
        show: false,
      },
      {
        value: "publisher_place",
        text: "reference.publisher_place",
        show: false,
      },
      {
        value: "journal__id",
        text: "reference.journal__id",
        show: false,
      },
      {
        value: "journal_txt",
        text: "reference.journal_txt",
        show: false,
      },
      {
        value: "journal_additional",
        text: "reference.journal_additional",
        show: false,
      },
      {
        value: "number",
        text: "reference.number",
        show: false,
      },
      {
        value: "figures",
        text: "reference.figures",
        show: false,
      },
      {
        value: "issn",
        text: "reference.issn",
        show: false,
      },
      {
        value: "isbn",
        text: "reference.isbn",
        show: false,
      },
      {
        value: "abstract",
        text: "reference.abstract",
        show: false,
      },
      {
        value: "author_keywords",
        text: "reference.author_keywords",
        show: false,
      },
      {
        value: "tags",
        text: "reference.tags",
        show: false,
      },
      {
        value: "remarks",
        text: "reference.remarks",
        show: false,
      },
      {
        value: "remarks_private",
        text: "reference.remarks_private",
        show: false,
      },
      {
        value: "is_oa",
        text: "reference.is_oa",
        show: false,
      },
      {
        value: "licence__id",
        text: "reference.licence__id",
        show: false,
      },
      {
        value: "licence__licence",
        text: "reference.licence__licence",
        show: false,
      },
      {
        value: "licence__licence_en",
        text: "reference.licence__licence_en",
        show: false,
      },
      {
        value: "egf",
        text: "reference.egf",
        show: false,
      },
      {
        value: "is_private",
        text: "reference.is_private",
        show: false,
      },
      {
        value: "is_locked",
        text: "reference.is_locked",
        show: false,
      },
      {
        value: "location_txt",
        text: "reference.location_txt",
        show: false,
      },
      {
        value: "is_estonian_author",
        text: "reference.is_estonian_author",
        show: false,
      },
      {
        value: "parent_reference__id",
        text: "reference.parent_reference__id",
        show: false,
      },
      {
        value: "parent_reference__reference",
        text: "reference.parent_reference__reference",
        show: false,
      },
      {
        value: "translated_reference__id",
        text: "reference.translated_reference__id",
        show: false,
      },
      {
        value: "translated_reference__reference",
        text: "reference.translated_reference__reference",
        show: false,
      },
      {
        value: "user_added",
        text: "reference.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "reference.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "reference.user_changed",
        show: false,
      },
      {
        value: "uuid",
        text: "reference.uuid",
        show: false,
      },
    ],
  };
};

const state = getDefaultState();

const getters = {
  getField,
};

const actions = {};

const mutations = {
  updateField,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  getDefaultState,
};
