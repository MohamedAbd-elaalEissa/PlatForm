export interface StudentAnswerFilterModel {
    teacherId: number,
    filesId: number,
    studentId?: number,
    AnswerName?: string,
    StudentName?: string,
    AcademicLevelName?: string,
    FileAnswersID?: number,
    AcademicLevelId?: number,
    pageNumber: number,
    pageSize: number,
}
export interface TeacherFileModel {
    teacherId: number,
    taskName?: string,
    academicLevelId?: number,
    pageNumber: number,
    pageSize: number,
}

export interface academicLevelDataModel {
    academicLevelID: number,
    academicLevelName?: string,
}

export interface TeachersVideosDataModel {
    teacherId: string,
    videoName?: number,
    academicLevelId?: number, 
    pageNumber: number,
    pageSize: number,
}

export interface RegisterModel {
    userName: string,
    email: string,
    phoneNumber:string,
    password:string
}

export interface LogInModel {
    email: string,
    password:string
}
