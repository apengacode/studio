import type { FormRules } from 'element-plus';
export interface State {
  searchValue: string;
  visible: boolean;
  tableData: FieldData[];
  selections: FieldData[];

  fieldForm: FieldForm;
  fieldFormRules: FormRules<FieldForm>;
}
export interface FieldForm {
  fieldName: undefined | string;
  caption: undefined | string;
  enUs: undefined | string;
}
export interface Dictionary {
  id: string;
  name: string;
} 

export interface FieldData {
  id?: string;
  fieldName?: undefined | string;
  caption?: undefined | string;
  enUs?: undefined | string;
  editabled?: boolean;

  required?: string | undefined;
  hidden?: string | undefined;
  readonly?: string | undefined;
  columnNumber?: number | undefined;
  displayType: string;
  dict?: Dictionary[] | undefined;
  dictUrl?: string | undefined;

  'grid.required'?: string | undefined;
  'grid.hidden'?: string | undefined;
  'grid.readonly'?: string | undefined;
  'grid.fixed'?: string | undefined;
  'grid.width'?: string | undefined;
  'grid.validRule'?: string | undefined;
  'grid.validLength'?: number | undefined;
  'grid.validType'?: string | undefined;

  'form.required'?: string | undefined;
  'form.hidden'?: string | undefined;
  'form.readonly'?: string | undefined;
  'form.placeholder'?: string | undefined;
  'form.displayType'?: string | undefined;
  'form.linkUrl'?: string | undefined;
  'form.linkField'?: string | undefined;
  'form.validRule'?: string | undefined;
  'form.validLength'?: number | undefined;
  'form.validType'?: string | undefined;

  'search.search'?: string | undefined;
  'search.quickSearch'?: string | undefined;
  'search.required'?: string | undefined;
  'search.readonly'?: string | undefined;
  'search.displayType'?: string | undefined;
  'search.linkUrl'?: string | undefined;
  'search.linkField'?: string | undefined;
  'search.placeholder'?: string | undefined;
  'search.validRule'?: string | undefined;
  'search.validLength'?: number | undefined;
  'search.validType'?: string | undefined;

  'validate.rule'?: string | undefined;
  'validate.length'?: number | undefined;
  'validate.type'?: string | undefined;
}
