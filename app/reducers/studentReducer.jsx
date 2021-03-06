import axios from 'axios';

//-------------------------------------
//ACTION TYPES
//-------------------------------------

const STUDENT_ADDED = 'STUDENT_ADDED';
const STUDENT_DELETED = 'STUDENT_DELETED';
const STUDENT_MODIFIED = 'STUDENT_MODIFIED';
const STUDENTS_LOADED = 'STUDENTS_LOADED';

//-------------------------------------
//ACTION CREATORS
//-------------------------------------

export const studentAdded = (student) => {
  return {
    type: STUDENT_ADDED,
    student: student
  }
}

export const studentDeleted = (student) => {
  return {
    type: STUDENT_DELETED,
    student: student
  }
}

export const studentModified = (student) => {
  return {
    type: STUDENT_MODIFIED,
    student: student
  }
}

export const studentsLoaded = (students) => {
  return {
    type: STUDENTS_LOADED,
    students: students
  }
}


//-------------------------------------
//REDUCER
//-------------------------------------
const reducer = (state = [], action) => {
  let newState = [];
  switch (action.type) {
    case STUDENT_ADDED:
      return [...state, action.student];
    case STUDENT_MODIFIED:
      newState = [...state];
      let oldIndex = state.findIndex((student) => student.id === action.student.id);
      newState[oldIndex] = action.student;
      return newState;
    case STUDENT_DELETED:
      oldIndex = state.findIndex((student) => student.id === action.student.id);
      newState = state.slice(0, oldIndex);
      newState = newState.concat(state.slice(oldIndex + 1));
      return newState;
    case STUDENTS_LOADED:
      return action.students;
    default:
      return state;
  }
}

//-------------------------------------
//THUNK CREATORS
//-------------------------------------
export const createStudent = (student) => {
  return (dispatch) => {
    axios.post('/api/students/', student)
      .then(res => res.data)
      .then(returnedstudent => {
        dispatch(studentAdded(returnedstudent));
      })
      .catch(console.log.bind(console))
  }
}

export const deleteStudent = (student) => {
  return (dispatch) => {
    axios.delete(`/api/students/${student.id}`)
      .then(() => {
        dispatch(studentDeleted(student));
      })
      .catch(console.log.bind(console))
  }
}

export const modifyStudent = (student) => {
  return (dispatch) => {
    axios.put(`/api/students/${student.id}`, student)
      .then(res => res.data)
      .then(returnedStudent => {
        dispatch(studentModified(returnedStudent));
      })
      .catch(console.log.bind(console))
  }
}

export const loadStudents = () => {
  return (dispatch) => {
    axios.get('/api/students/')
      .then(res => res.data)
      .then(students => {
        dispatch(studentsLoaded(students));
      })
      .catch(console.log.bind(console))
  }
}

//-------------------------------------
// DEFAULT EXPORT (placed here for ease finding it later)
//-------------------------------------
export default reducer;
