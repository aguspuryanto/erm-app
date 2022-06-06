export let CONFIGURATION = {
  apiEndpoint: 'http://care3.dxn2u.net:8282/workflow2',
  DATA_KEY: 'mydata',
  TOKEN_KEY: 'my-token',
  LOGIN_KEY: 'mylogin',

  URL: {
    Login_Update: 'Login_Update',
    CheckUser: 'CheckUser',
    API_Menu: 'API_Menu',
    DataSource: 'DataSource',
    SelectTasks: 'SelectTasks',
    Select: 'Select',
  },

  segmentRiskMenu: [
    { text: 'Control Owner', icon: 'assets/icon-task-assignment.svg' },
    { text: 'Risk Owner', icon: 'assets/icon-task-mytask.svg' },
    { text: 'CC Risk', icon: 'assets/icon-task-cctask.svg' },
  ],

  segmentTaskMenu: [
    { text: 'Assignments', icon: 'assets/icon-task-assignment.svg' },
    { text: 'Group Tasks', icon: 'assets/icon-task-grouptask.svg' },
    { text: 'My Tasks', icon: 'assets/icon-task-mytask.svg' },
    { text: 'Request', icon: 'assets/icon-task-request.svg' },
    { text: 'CC Tasks', icon: 'assets/icon-task-cctask.svg' },
    { text: 'Flagged Task', icon: 'assets/icon-task-flaggedtask.svg' }
  ],

  segmentApprovalMenu: [
    { text: 'My Request', icon: 'assets/icon-approval-myrequest.svg' },
    { text: 'My Approval', icon: 'assets/icon-approval-myapproval.svg' },
    { text: 'CC Approval', icon: 'assets/icon-approval-ccapproval.svg' },
    { text: 'Action History', icon: 'assets/icon-approval-actionhistory.svg' }
  ],

  // vTitle
  listTaskId: {
    request: 3,
    grouptask: 4,
    mytask: 8,
    flaggedtask: 17,
    assignment: 11,
    cctask: 25,
  },
  
  liststsfilter: {
    Unassigned: 2,
    Active: 3,
    Overdue: 4,
    Completed: 5,
    Closed: 6,
    Canceled: 8,
    Archived: 9,
  }
}