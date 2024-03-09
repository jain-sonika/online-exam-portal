const environment = process.env.NODE_ENV;

let base_local_url = 'http://localhost:3000';
let base_backend_url = 'http://localhost:5000';
if(environment==='docker') {
  base_local_url = 'http://user-frontend-app:3000';
  base_backend_url = 'http://backend:5000';
}

const apis = {
  BASE_LOCAL_URL:base_local_url,
  BASE : base_backend_url,
  LOGIN : "/api/v1/adminlogin/",
  REGISTER_USER : "/api/v1/public/register",
  GET_ADMIN_DETAILS : "/api/v1/admin/details",
  GET_DASHBOARD_COUNT : "/api/v1/admin/getDashboardCount",
  GET_TEACHER_DETAILS : "/api/v1/admin/getAllTeachers",
  REMOVE_USER : "/api/v1/admin/removeUser",
  UNBLOCK_USER : "/api/v1/admin/unblockUser",
  GET_STUDENT_DETAILS : "/api/v1/admin/getAllStudent",
  GET_SUBJECT_DETAILS : "/api/v1/admin/getAllSubjects",
  REMOVE_SUBJECT : "/api/v1/admin/removeSubject",
  UNBLOCK_SUBJECT : "/api/v1/admin/unblockSubject",
  ADD_TEACHER : "/api/v1/admin/register",
  ADD_SUBJECT : "/api/v1/admin/addSubject"
}

export default apis;