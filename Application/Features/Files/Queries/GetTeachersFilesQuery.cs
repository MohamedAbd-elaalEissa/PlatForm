using ApplicationContract.IFiles;
using ApplicationContract.Models;
using ApplicationContract.Models.File;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Files.Queries
{
    public record GetTeachersFilesQuery(TeacherFileDTO teacherFile) :IRequest<PaginatedResult<Domain.Entities.Files>>;

    public class GetTeachersFilesQueryHandler : IRequestHandler<GetTeachersFilesQuery, PaginatedResult<Domain.Entities.Files>>
    {
        private readonly IFilesRepository _repository;

        public GetTeachersFilesQueryHandler(IFilesRepository repository)
        {
            _repository = repository;
        }
        public async Task<PaginatedResult<Domain.Entities.Files>> Handle(GetTeachersFilesQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetTeachersFilesAsync(request.teacherFile);
        }
    }
}
