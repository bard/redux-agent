export interface BaseTask {
  type: string
}

export interface IOTask extends BaseTask {
  actions: { [type: string]: string }
}

export interface SystemTask {
  type: 'system'
  nextTaskId: number
}

interface LocalStorageBaseTask {
  type: 'storage'
  key: string
  actions: {
    success: string
    failure: string
  }
}

interface LocalStorageTaskDel extends LocalStorageBaseTask {
  op: 'del'
}

interface LocalStorageTaskGet extends LocalStorageBaseTask {
  op: 'get'
}

interface LocalStorageTaskPop extends LocalStorageBaseTask {
  op: 'pop'
}

interface LocalStorageTaskSet extends LocalStorageBaseTask {
  op: 'set'
  data: any
}

interface LocalStorageTaskMerge extends LocalStorageBaseTask {
  op: 'merge'
  data: any
}

export type LocalStorageTask =
  | LocalStorageTaskGet
  | LocalStorageTaskPop
  | LocalStorageTaskSet
  | LocalStorageTaskMerge
  | LocalStorageTaskDel

interface HttpTask extends Partial<RequestInit> {
  type: 'http'
  url: string
  body?: any
  actions: {
    success: string
    failure: string
  }
}

export type Task =
  | BaseTask
  | LocalStorageTask
  | HttpTask
  | SystemTask

export interface TaskCollection {
  [tid: string]: BaseTask
}

export interface State {
  tasks: TaskCollection
}
