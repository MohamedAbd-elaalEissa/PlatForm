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