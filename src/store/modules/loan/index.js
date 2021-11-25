import { getField, updateField } from "vuex-map-fields";

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: {
      page: 1,
      paginateBy: 50,
      sortBy: ["id"],
      sortDesc: [true],
    },
    viewType: "table",
    searchFields: {
      byIds: {
        borrower: {
          lookUpType: "icontains",
          title: "loan.borrower",
          value: null,
          fields: [
            "borrower__agent",
            "borrower__forename",
            "borrower__surename",
          ],
          type: "multi",
        },
        borrower_institution: {
          lookUpType: "icontains",
          title: "loan.borrower_institution__id",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "loan.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "loan.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "loan.date_changed",
          value: null,
        },
        date_end: {
          lookUpType: "lt",
          title: "loan.date_end",
          value: null,
          isDate: true,
        },
        date_returned: {
          lookUpType: "icontains",
          title: "loan.date_returned",
          value: null,
        },
        date_signed: {
          lookUpType: "icontains",
          title: "loan.date_signed",
          value: null,
        },
        date_start: {
          lookUpType: "gt",
          title: "loan.date_start",
          value: null,
          isDate: true,
        },
        deliverer: {
          lookUpType: "icontains",
          title: "loan.deliverer__id",
          value: null,
        },
        delivery_method: {
          lookUpType: "icontains",
          title: "loan.delivery_method__id",
          value: null,
        },
        delivery_remarks: {
          lookUpType: "icontains",
          title: "loan.delivery_remarks",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "loan.id",
          value: null,
        },
        loan_number: {
          lookUpType: "icontains",
          title: "loan.loan_number",
          value: null,
        },
        loaner: {
          lookUpType: "icontains",
          title: "loan.loaner__id",
          value: null,
        },
        project: {
          lookUpType: "icontains",
          title: "loan.project",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "loan.remarks",
          value: null,
        },
        returned: {
          lookUpType: "exact",
          title: "loan.isActive",
          value: null,
          isCheckbox: true,
        },
        special: {
          lookUpType: "icontains",
          title: "loan.special",
          value: null,
        },
        type: {
          lookUpType: "icontains",
          title: "loan.type__id",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "loan.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "loan.user_changed",
          value: null,
        },
      },
      mainIds: [
        "loan_number",
        "project",
        "borrower",
        "date_start",
        "date_end",
        "returned",
      ],
      extraIds: [
        "borrower_institution",
        "database",
        "date_added",
        "date_changed",
        "date_returned",
        "date_signed",
        "deliverer",
        "delivery_method",
        "delivery_remarks",
        "id",
        "loaner",
        "remarks",
        "special",
        "type",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "print",
        text: "loan.print",
        sortable: false,
        show: true,
      },
      {
        value: "id",
        text: "loan.id",
        show: true,
      },
      {
        value: "loan_number",
        text: "loan.loan_number",
        show: true,
      },
      {
        value: "project",
        text: "loan.project",
        show: true,
      },
      {
        value: "date_start",
        text: "loan.date_start",
        show: true,
      },
      {
        value: "date_end",
        text: "loan.date_end",
        show: true,
      },
      {
        value: "returned",
        text: "loan.returned",
        show: true,
      },
      {
        value: "type__id",
        text: "loan.type__id",
        show: false,
      },
      {
        value: "type__value",
        text: "loan.type__value",
        show: false,
      },
      {
        value: "type__value_en",
        text: "loan.type__value_en",
        show: false,
      },
      {
        value: "borrower__id",
        text: "loan.borrower__id",
        show: false,
      },
      {
        value: "borrower__agent",
        text: "loan.borrower__agent",
        show: false,
      },
      {
        value: "borrower_institution",
        text: "loan.borrower_institution",
        show: false,
      },
      {
        value: "borrower_institution__agent",
        text: "loan.borrower_institution__agent",
        show: false,
      },
      {
        value: "loaner__id",
        text: "loan.loaner__id",
        show: false,
      },
      {
        value: "loaner__agent",
        text: "loan.loaner__agent",
        show: false,
      },
      {
        value: "date_signed",
        text: "loan.date_signed",
        show: false,
      },
      {
        value: "delivery_method__id",
        text: "loan.delivery_method__id",
        show: false,
      },
      {
        value: "delivery_method__value",
        text: "loan.delivery_method__value",
        show: false,
      },
      {
        value: "delivery_method__value_en",
        text: "loan.delivery_method__value_en",
        show: false,
      },
      {
        value: "deliverer__id",
        text: "loan.deliverer__id",
        show: false,
      },
      {
        value: "deliverer__agent",
        text: "loan.deliverer__agent",
        show: false,
      },
      {
        value: "delivery_remarks",
        text: "loan.delivery_remarks",
        show: false,
      },
      {
        value: "date_returned",
        text: "loan.date_returned",
        show: false,
      },
      {
        value: "special",
        text: "loan.special",
        show: false,
      },
      {
        value: "remarks",
        text: "loan.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "loan.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "loan.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "loan.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "loan.date_changed",
        show: false,
      },
      {
        value: "database__id",
        text: "loan.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "loan.database__acronym",
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
};
