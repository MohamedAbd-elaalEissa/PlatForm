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
    chapterId: number
    taskName?: string,
    academicLevelId?: number,
    isBook?: boolean,
    pageNumber: number,
    pageSize: number,
}

export interface ChapterModel {
    chapterID?: string,
    teacherId: string,
    academicLevelId?: number,
    chapterName?: string,
    pageNumber?: number,
    pageSize?: number,
}

export interface ChapterUpdateModel {
    chaptersID: string,
    teacherId: string,
    academicLevelId: number,
    chapterName: string,
}

export interface academicLevelDataModel {
    academicLevelID: number,
    academicLevelName: string,
}

export interface TeachersVideosDataModel {
    teacherId: string,
    chapterId: number,
    videoName?: number,
    academicLevelId?: number,
    isBook?: boolean,
    pageNumber: number,
    pageSize: number,
}

export interface RegisterModel {
    userName: string,
    email: string,
    phoneNumber: string,
    password: string,
    isTeacher: boolean
}

export interface LogInModel {
    email: string,
    password: string
}
