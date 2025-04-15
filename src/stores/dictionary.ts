import { defineStore } from 'pinia';
export const usePinia = defineStore('dictionary', {
  state: () => {
    return {
      yesOrNo: [
        {
          id: '1',
          name: '是',
        },
        {
          id: '0',
          name: '否',
        },
      ],
      displayType: [
        {
          id: 'text',
          name: '文本',
        },
        {
          id: 'number',
          name: '数字',
        },
        {
          id: 'number-range',
          name: '数字范围',
        },
        {
          id: 'textarea',
          name: '文本域',
        },
        {
          id: 'select',
          name: '下拉单选',
        },
        {
          id: 'select-multiple',
          name: '下拉多选',
        },
        {
          id: 'date-local',
          name: '日期',
        },
        {
          id: 'date-local-range',
          name: '日期范围',
        },
        {
          id: 'date-ym',
          name: '年月',
        },
        {
          id: 'date-ym-range',
          name: '年月范围',
        },
        {
          id: 'date-time',
          name: '日期及时间',
        },
        {
          id: 'date-time-range',
          name: '日期及时间范围',
        },
        {
          id: '上传',
          name: 'file',
        },
        {
          id: 'switch',
          name: '开关',
        },
        {
          id: '单选组',
          name: 'radio',
        },
        {
          id: '多选组',
          name: 'checkbox',
        },
      ],
      validateType: [
        {
          id: 'email',
          name: '邮箱',
        },
        {
          id: 'mobile',
          name: '手机号码',
        },
        {
          id: 'telephone',
          name: '电话号码',
        },
        {
          id: 'postalCode',
          name: '邮政编码',
        },
        {
          id: 'idCode',
          name: '身份证号',
        },
        {
          id: 'number',
          name: '数字',
        },
        {
          id: 'number',
          name: '数字',
        },
        {
          id: 'integer',
          name: '整数',
        },
        {
          id: 'chinese',
          name: '中文',
        },
        {
          id: 'integer+',
          name: '正整数',
        },
        {
          id: 'integer0',
          name: '自然数',
        },
        {
          id: 'money',
          name: '金额',
        },
        {
          id: 'score',
          name: '分数',
        },
      ],
    };
  },
  actions: {
    //使用async await 语法糖，处理一下Promise
  },
});
