using ApplicationContract.IFiles;
using ApplicationContract.Models;
using ApplicationContract.Models.File;
using MediatR;


namespace Application.Features.Files.Queries
{
   
    public record StudentAnswerFilesQuery(StudentAnswerFilesDTO studentAnswerFiles) : IRequest<PaginatedResult<StudentAnswerFilesDTO>>;

    public class StudentAnswerFilesQueryHandler : IRequestHandler<StudentAnswerFilesQuery,PaginatedResult<StudentAnswerFilesDTO>>
    {
        private readonly IFilesRepository _repository;

        public StudentAnswerFilesQueryHandler(IFilesRepository repository)
        {
            _repository = repository;
        }
        public async Task<PaginatedResult<StudentAnswerFilesDTO>> Handle(StudentAnswerFilesQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetStudentAnswerAsync(request.studentAnswerFiles);
        }
    }
}
