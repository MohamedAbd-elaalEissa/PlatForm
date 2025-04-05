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
    public record GetTeachersVideoQuery(TeacherVideoDTO teacherVideo) :IRequest<PaginatedResult<Domain.Entities.Videos>>;

    public class GetTeachersVideoQueryHandler : IRequestHandler<GetTeachersVideoQuery, PaginatedResult<Domain.Entities.Videos>>
    {
        private readonly IFilesRepository _repository;

        public GetTeachersVideoQueryHandler(IFilesRepository repository)
        {
            _repository = repository;
        }
        public async Task<PaginatedResult<Domain.Entities.Videos>> Handle(GetTeachersVideoQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetTeachersVideoAsync(request.teacherVideo);
        }
    }
}
