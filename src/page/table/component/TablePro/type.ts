import type { FieldData } from '@/page/action/component/Action/Fields/type';

export type Column = FieldData & {
  show?: string; // 查询中展开收起的现实隐藏
  id: string;
  fieldName: string;
  caption: string;
  enUs: string;
};

export interface RequestPage {
  pageIndex: number;
  pageSize: number;
}
export interface Page {
  pageIndex: number;
  pageSize: number;
  total: number;
}

export interface Response<T> {
  success: boolean;
  data: {
    total: number;
    rows: T;
  };
  message?: string;
}

export interface Button {
  key: string;
  text: string;
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  canBatch?: boolean;
  canSingle?: boolean;
  checkRecords?: boolean;
  permission?: string;
  children?: Button[];
  beforRender?: (row: { [key: string]: any }) => boolean;
  callback?: (
    params: { [key: string]: any },
    records: { [key: string]: any }[],
  ) => void;
}

export interface BatchButton {
  key: string;
  text: string;
  type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  checkRecords: boolean;
  permission?: string;
  children?: BatchButton[];
  callback?: (
    params: { [key: string]: any },
    records: { [key: string]: any }[],
  ) => void;
}
export interface SingleButton {
  key: string;
  text: string;
  permission?: string;
  children?: SingleButton[];
  beforRender?: (row: { [key: string]: any }) => boolean;
  callback?: (
    params: { [key: string]: any },
    records: { [key: string]: any }[],
  ) => void;
}
