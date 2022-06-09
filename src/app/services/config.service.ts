export let CONFIGURATION = {
  apiEndpoint: 'http://care3.dxn2u.net:8282/workflow2',
  webapiEndpoint: 'https://erm-dev.dxn2u.com',
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

  listGroupFilter: [
    {my_val: 0, my_text:'No Grouping'},
    {my_val: 1, my_text:'Country'},
    {my_val: 2, my_text:'Company'},
    {my_val: 3, my_text:'Department'},
    {my_val: 4, my_text:'Category'},
    {my_val: 5, my_text:'Assignor'},
    {my_val: 6, my_text:'Priority'},
    {my_val: 8, my_text:'Last Updated Date'},
    {my_val: 9, my_text:'Last Updated User'},
    {my_val: 10, my_text:'Next Reporting Date'},
    {my_val: 11, my_text:'Topic'}
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