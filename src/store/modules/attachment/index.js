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
        agent_digitised: {
          lookUpType: "icontains",
          title: "attachment.agent_digitised__id",
          value: null,
        },
        attachment_format: {
          lookUpType: "icontains",
          title: "attachment.attachment_format__id",
          value: null,
        },
        author: {
          lookUpType: "icontains",
          title: "attachment.author",
          value: null,
          fields: [
            "author__agent",
            "author__forename",
            "author__surename",
            "author_free",
            "user_added",
          ],
          type: "multi",
        },
        author_free: {
          lookUpType: "icontains",
          title: "attachment.author_free",
          value: null,
        },
        boolean1: {
          lookUpType: "icontains",
          title: "attachment.boolean1",
          value: null,
        },
        copyright_agent: {
          lookUpType: "icontains",
          title: "attachment.copyright_agent__id",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "attachment.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "attachment.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "attachment.date_changed",
          value: null,
        },
        date_created: {
          lookUpType: "icontains",
          title: "attachment.date_created",
          value: null,
        },
        date_created_free: {
          lookUpType: "icontains",
          title: "attachment.date_created_free",
          value: null,
        },
        date_digitised: {
          lookUpType: "icontains",
          title: "attachment.date_digitised",
          value: null,
        },
        date_digitised_free: {
          lookUpType: "icontains",
          title: "attachment.date_digitised_free",
          value: null,
        },
        description: {
          lookUpType: "icontains",
          title: "attachment.description",
          value: null,
        },
        description_en: {
          lookUpType: "icontains",
          title: "attachment.description_en",
          value: null,
        },
        device: {
          lookUpType: "icontains",
          title: "attachment.device__id",
          value: null,
        },
        device_digitised: {
          lookUpType: "icontains",
          title: "attachment.device_digitised__id",
          value: null,
        },
        device_txt: {
          lookUpType: "icontains",
          title: "attachment.device_txt",
          value: null,
        },
        drillcore: {
          lookUpType: "icontains",
          title: "attachment.drillcore__id",
          value: null,
        },
        drillcore_box: {
          lookUpType: "icontains",
          title: "attachment.drillcore_box__id",
          value: null,
        },
        drillcore_image_id: {
          lookUpType: "icontains",
          title: "attachment.drillcore_image_id",
          value: null,
        },
        filename: {
          lookUpType: "icontains",
          title: "attachment.filename",
          value: null,
          fields: ["original_filename", "uuid_filename"],
          type: "multi",
        },
        id: {
          lookUpType: "icontains",
          title: "attachment.id",
          value: null,
        },
        image_altitude: {
          lookUpType: "icontains",
          title: "attachment.image_altitude",
          value: null,
        },
        image_category: {
          lookUpType: "icontains",
          title: "attachment.image_category__id",
          value: null,
        },
        image_description: {
          lookUpType: "icontains",
          title: "attachment.image_description",
          value: null,
        },
        image_description_en: {
          lookUpType: "icontains",
          title: "attachment.image_description_en",
          value: null,
        },
        image_height: {
          lookUpType: "icontains",
          title: "attachment.image_height",
          value: null,
        },
        image_id: {
          lookUpType: "icontains",
          title: "attachment.image_id",
          value: null,
        },
        image_latitude: {
          lookUpType: "icontains",
          title: "attachment.image_latitude",
          value: null,
        },
        image_longitude: {
          lookUpType: "icontains",
          title: "attachment.image_longitude",
          value: null,
        },
        image_number: {
          lookUpType: "icontains",
          title: "attachment.photoNumber",
          value: null,
        },
        image_object: {
          lookUpType: "icontains",
          title: "attachment.image_object",
          value: null,
        },
        image_people: {
          lookUpType: "icontains",
          title: "attachment.image_people",
          value: null,
        },
        image_place: {
          lookUpType: "icontains",
          title: "attachment.image_place",
          value: null,
        },
        image_scalebar: {
          lookUpType: "icontains",
          title: "attachment.image_scalebar",
          value: null,
        },
        image_type: {
          lookUpType: "icontains",
          title: "attachment.image_type__id",
          value: null,
        },
        image_width: {
          lookUpType: "icontains",
          title: "attachment.image_width",
          value: null,
        },
        imageset: {
          lookUpType: "icontains",
          title: "attachment.photoNumber",
          value: null,
        },
        is_locked: {
          lookUpType: "icontains",
          title: "attachment.is_locked",
          value: null,
        },
        is_preferred: {
          lookUpType: "icontains",
          title: "attachment.is_preferred",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "attachment.is_private",
          value: null,
        },
        licence: {
          lookUpType: "icontains",
          title: "attachment.licence__id",
          value: null,
        },
        original_filename: {
          lookUpType: "icontains",
          title: "attachment.original_filename",
          value: null,
        },
        reference: {
          lookUpType: "icontains",
          title: "attachment.reference__id",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "attachment.remarks",
          value: null,
        },
        size_mb: {
          lookUpType: "icontains",
          title: "attachment.size_mb",
          value: null,
        },
        specimen: {
          lookUpType: "icontains",
          title: "attachment.specimen",
          value: null,
          fields: ["specimen__specimen_id"],
          type: "multi",
        },
        specimen_image_attachment: {
          lookUpType: "in",
          title: "attachment.specimen_image_attachment",
          value: ["2", "1", "3", "4"],
          type: "multi_checkbox",
        },
        specimen_image_id: {
          lookUpType: "icontains",
          title: "attachment.specimen_image_id",
          value: null,
        },
        stars: {
          lookUpType: "icontains",
          title: "attachment.stars",
          value: null,
        },
        storage: {
          lookUpType: "icontains",
          title: "attachment.storage",
          value: null,
        },
        tags: {
          lookUpType: "icontains",
          title: "attachment.tags",
          value: null,
        },
        type: {
          lookUpType: "icontains",
          title: "attachment.type__id",
          value: null,
        },
        upload: {
          lookUpType: "icontains",
          title: "attachment.upload",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "attachment.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "attachment.user_changed",
          value: null,
        },
        uuid: {
          lookUpType: "icontains",
          title: "attachment.uuid",
          value: null,
        },
        uuid_filename: {
          lookUpType: "icontains",
          title: "attachment.uuid_filename",
          value: null,
        },
        image_info: {
          lookUpType: "icontains",
          title: "attachment.imageInfo",
          value: null,
          fields: [
            "description",
            "description_en",
            "image_place",
            "image_object",
            "image_people",
            "image_description",
            "image_description_en",
            "tags",
          ],
          type: "multi",
        },
        selection: {
          lookUpType: "icontains",
          title: "specimen.selection",
          value: null,
          fields: ["selection__selection__name"],
          type: "multi",
        },
        locality: {
          lookUpType: "icontains",
          title: "attachment.locality",
          value: null,
          fields: ["locality__locality", "locality__locality_en"],
          type: "multi",
        },
        keyword: {
          lookUpType: "icontains",
          title: "keyword.keyword",
          value: null,
          fields: [
            "attachment_keyword__keyword__keyword",
            "description",
            "description_en",
            "image_place",
            "image_object",
            "image_people",
            "image_description",
            "image_description_en",
            "tags",
          ],
          type: "multi",
        },
      },
      mainIds: [
        "id",
        "filename",
        "image_number",
        "specimen",
        "image_info",
        "locality",
        "selection",
        "keyword",
        "author",
      ],
      extraIds: [
        "agent_digitised",
        "attachment_format",
        "author",
        "author_free",
        "copyright_agent",
        "database",
        "date_added",
        "date_changed",
        "date_created",
        "date_created_free",
        "date_digitised",
        "date_digitised_free",
        "description",
        "description_en",
        "device",
        "device_digitised",
        "device_txt",
        "drillcore",
        "drillcore_box",
        "drillcore_image_id",
        "filename",
        "image_altitude",
        "image_category",
        "image_description",
        "image_description_en",
        "image_height",
        "image_id",
        "image_latitude",
        "image_longitude",
        "image_number",
        "image_object",
        "image_people",
        "image_place",
        "image_scalebar",
        "image_type",
        "image_width",
        "imageset",
        "is_locked",
        "is_preferred",
        "is_private",
        "licence",
        "locality",
        "reference",
        "remarks",
        "original_filename",
        "size_mb",
        "specimen",
        "specimen_image_id",
        "stars",
        "storage",
        "tags",
        "type",
        "upload",
        "user_added",
        "user_changed",
        "uuid",
        "uuid_filename",
      ],
    },
    headers: [
      {
        value: "uuid_filename",
        text: "attachment.uuid_filename",
        show: true,
      },
      {
        value: "id",
        text: "attachment.id",
        show: true,
      },
      {
        value: "attachment_format.value",
        text: "attachment.attachment_format__value",
        show: true,
      },
      {
        value: "image_number",
        text: "attachment.image_number",
        show: true,
      },
      {
        value: "author.agent",
        text: "attachment.author__agent",
        show: true,
      },
      {
        value: "date_created",
        text: "attachment.date_created",
        show: true,
      },
      {
        value: "reference.reference",
        text: "attachment.reference__reference",
        show: true,
      },
      {
        value: "specimen_image_attachment",
        text: "attachment.specimen_image_attachment",
        show: true,
      },
      {
        value: "is_private",
        text: "attachment.is_private",
        show: true,
      },
      {
        value: "link",
        text: "attachment.link",
        sortable: false,
        show: true,
      },
      {
        value: "original_filename",
        text: "attachment.original_filename",
        show: false,
      },
      {
        value: "filename",
        text: "attachment.filename",
        show: false,
      },
      {
        value: "type.id",
        text: "attachment.type__id",
        show: false,
      },
      {
        value: "type.value",
        text: "attachment.type__value",
        show: false,
      },
      {
        value: "type.value_en",
        text: "attachment.type__value_en",
        show: false,
      },
      {
        value: "attachment_format.id",
        text: "attachment.attachment_format__id",
        show: false,
      },
      {
        value: "author.id",
        text: "attachment.author__id",
        show: false,
      },
      {
        value: "author_free",
        text: "attachment.author_free",
        show: false,
      },
      {
        value: "date_created_free",
        text: "attachment.date_created_free",
        show: false,
      },
      {
        value: "device_.id",
        text: "attachment.device__id",
        show: false,
      },
      {
        value: "device.name",
        text: "attachment.device__name",
        show: false,
      },
      {
        value: "device_txt",
        text: "attachment.device_txt",
        show: false,
      },
      {
        value: "date_digitised",
        text: "attachment.date_digitised",
        show: false,
      },
      {
        value: "date_digitised_free",
        text: "attachment.date_digitised_free",
        show: false,
      },
      {
        value: "agent_digitised.id",
        text: "attachment.agent_digitised__id",
        show: false,
      },
      {
        value: "agent_digitised.agent",
        text: "attachment.agent_digitised__agent",
        show: false,
      },
      {
        value: "device_digitised.id",
        text: "attachment.device_digitised__id",
        show: false,
      },
      {
        value: "device_digitised.name",
        text: "attachment.device_digitised__name",
        show: false,
      },
      {
        value: "copyright_agent.id",
        text: "attachment.copyright_agent__id",
        show: false,
      },
      {
        value: "copyright_agent.agent",
        text: "attachment.copyright_agent__agent",
        show: false,
      },
      {
        value: "licence.id",
        text: "attachment.licence__id",
        show: false,
      },
      {
        value: "licence.licence",
        text: "attachment.licence__licence",
        show: false,
      },
      {
        value: "licence.licence_en",
        text: "attachment.licence__licence_en",
        show: false,
      },
      {
        value: "description",
        text: "attachment.description",
        show: false,
      },
      {
        value: "description_en",
        text: "attachment.description_en",
        show: false,
      },
      {
        value: "size_mb",
        text: "attachment.size_mb",
        show: false,
      },
      {
        value: "remarks",
        text: "attachment.remarks",
        show: false,
      },
      {
        value: "tags",
        text: "attachment.tags",
        show: false,
      },
      {
        value: "stars",
        text: "attachment.stars",
        show: false,
      },
      {
        value: "is_preferred",
        text: "attachment.is_preferred",
        show: false,
      },
      {
        value: "is_locked",
        text: "attachment.is_locked",
        show: false,
      },
      {
        value: "boolean1",
        text: "attachment.boolean1",
        show: false,
      },
      {
        value: "specimen__id",
        text: "attachment.specimen__id",
        show: false,
      },
      {
        value: "specimen__specimen_id",
        text: "attachment.specimen__specimen_id",
        show: false,
      },
      {
        value: "locality__id",
        text: "attachment.locality__id",
        show: false,
      },
      {
        value: "locality__locality",
        text: "attachment.locality__locality",
        show: false,
      },
      {
        value: "locality__locality_en",
        text: "attachment.locality__locality_en",
        show: false,
      },
      {
        value: "drillcore__id",
        text: "attachment.drillcore__id",
        show: false,
      },
      {
        value: "drillcore__drillcore",
        text: "attachment.drillcore__drillcore",
        show: false,
      },
      {
        value: "drillcore__drillcore_en",
        text: "attachment.drillcore__drillcore_en",
        show: false,
      },
      {
        value: "drillcore_box__id",
        text: "attachment.drillcore_box__id",
        show: false,
      },
      {
        value: "drillcore_box__number",
        text: "attachment.drillcore_box__number",
        show: false,
      },
      {
        value: "reference__id",
        text: "attachment.reference__id",
        show: false,
      },
      {
        value: "drillcore_image_id",
        text: "attachment.drillcore_image_id",
        show: false,
      },
      {
        value: "image_id",
        text: "attachment.image_id",
        show: false,
      },
      {
        value: "imageset__id",
        text: "attachment.imageset__id",
        show: false,
      },
      {
        value: "imageset__imageset_number",
        text: "attachment.imageset__imageset_number",
        show: false,
      },
      {
        value: "specimen_image_id",
        text: "attachment.specimen_image_id",
        show: false,
      },
      {
        value: "image_type__id",
        text: "attachment.image_type__id",
        show: false,
      },
      {
        value: "image_type__value",
        text: "attachment.image_type__value",
        show: false,
      },
      {
        value: "image_type__value_en",
        text: "attachment.image_type__value_en",
        show: false,
      },
      {
        value: "image_width",
        text: "attachment.image_width",
        show: false,
      },
      {
        value: "image_height",
        text: "attachment.image_height",
        show: false,
      },
      {
        value: "image_category__id",
        text: "attachment.image_category__id",
        show: false,
      },
      {
        value: "image_category__value",
        text: "attachment.image_category__value",
        show: false,
      },
      {
        value: "image_category__value_en",
        text: "attachment.image_category__value_en",
        show: false,
      },
      {
        value: "image_object",
        text: "attachment.image_object",
        show: false,
      },
      {
        value: "image_place",
        text: "attachment.image_place",
        show: false,
      },
      {
        value: "image_people",
        text: "attachment.image_people",
        show: false,
      },
      {
        value: "image_latitude",
        text: "attachment.image_latitude",
        show: false,
      },
      {
        value: "image_longitude",
        text: "attachment.image_longitude",
        show: false,
      },
      {
        value: "image_altitude",
        text: "attachment.image_altitude",
        show: false,
      },
      {
        value: "image_scalebar",
        text: "attachment.image_scalebar",
        show: false,
      },
      {
        value: "image_description",
        text: "attachment.image_description",
        show: false,
      },
      {
        value: "image_description_en",
        text: "attachment.image_description_en",
        show: false,
      },
      {
        value: "storage",
        text: "attachment.storage",
        show: false,
      },
      {
        value: "user_added",
        text: "attachment.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "attachment.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "attachment.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "attachment.date_changed",
        show: false,
      },
      {
        value: "database__id",
        text: "attachment.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "attachment.database__acronym",
        show: false,
      },
      {
        value: "upload",
        text: "attachment.upload",
        show: false,
      },
      {
        value: "uuid",
        text: "attachment.uuid",
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