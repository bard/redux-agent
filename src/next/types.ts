export interface Task {
  type: string
}

export interface SystemTask extends Task {
  nextTaskId: number
}

export interface IOTask extends Task {
  actions: {
    [key: string]: string
  }
}

export interface State {
  tasks: { [tid: string]: Task }
}


