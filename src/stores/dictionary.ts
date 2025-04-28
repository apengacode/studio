import { defineStore } from 'pinia';
import { DISPLAY_TYPE } from '@/const';
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
          id: DISPLAY_TYPE.TEXT,
          name: '文本',
        },
        {
          id: DISPLAY_TYPE.NUMBER,
          name: '数字',
        },
        {
          id: DISPLAY_TYPE.NUMBER_RANGE,
          name: '数字范围',
        },
        {
          id: DISPLAY_TYPE.TEXTAREA,
          name: '文本域',
        },
        {
          id: DISPLAY_TYPE.SELECT,
          name: '下拉单选',
        },
        {
          id: DISPLAY_TYPE.SELECT_MULTIPLE,
          name: '下拉多选',
        },
        {
          id: DISPLAY_TYPE.DATE_LOCAL,
          name: '日期',
        },
        {
          id: DISPLAY_TYPE.DATE_LOCAL_RANGE,
          name: '日期范围',
        },
        {
          id: DISPLAY_TYPE.DATE_YM,
          name: '年月',
        },
        {
          id: DISPLAY_TYPE.DATE_YM_RANGE,
          name: '年月范围',
        },
        {
          id: DISPLAY_TYPE.DATE_TIME,
          name: '日期及时间',
        },
        {
          id: DISPLAY_TYPE.DATE_TIME_RANGE,
          name: '日期及时间范围',
        },
        {
          id: DISPLAY_TYPE.FILE,
          name: 'file',
        },
        {
          id: DISPLAY_TYPE.SWITCH,
          name: '开关',
        },
        {
          id: DISPLAY_TYPE.RADIO,
          name: '单选组',
        },
        {
          id: DISPLAY_TYPE.CHECKBOX,
          name: '多选组',
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
