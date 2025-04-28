import { defineStore } from 'pinia';
export const usePinia = defineStore('const', {
  state: () => {
    return {
      defaultFieldValue: {
        fieldName: undefined,
        caption: undefined,
        enUs: undefined,
        editabled: false,

        quickSearch: undefined,
        required: undefined,
        hidden: undefined,
        readonly: undefined,
        columnNumber: undefined,
        displayType: 'text',

        'grid.required': undefined,
        'grid.hidden': undefined,
        'grid.readonly': undefined,
        'grid.fixed': undefined,
        'grid.width': undefined,

        'form.required': undefined,
        'form.hidden': undefined,
        'form.readonly': undefined,
        'form.displayType': undefined,
        'form.linkUrl': undefined,
        'form.linkField': undefined,

        'search.quickSearch': undefined,
        'search.required': undefined,
        'search.hidden': undefined,
        'search.readonly': undefined,
        'search.displayType': undefined,
        'search.linkUrl': undefined,
        'search.linkField': undefined,
        'search.columnNumber': undefined,

        'validate.rule': undefined,
        'validate.length': undefined,
        'validate.type': undefined,
      },
    };
  },
  actions: {
    //使用async await 语法糖，处理一下Promise
  },
});
