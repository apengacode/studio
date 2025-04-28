import type { FieldData } from '@/page/action/component/Action/Fields/type';

export type Column = FieldData & {
  show?: string;    // 查询中展开收起的现实隐藏
  id: string;
  fieldName: undefined | string;
  caption: undefined | string;
  enUs: undefined | string;
};
