export interface TreeNode {
  id: string;
  name: string;
  type: 'app' | 'page' | 'action';
  switch: string;
  children?: TreeNode[];
} 