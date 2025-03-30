using ApplicationContract.IFiles;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Files.Queries
{
    public record GetTeachersFilesQuery(int TeacherID):IRequest<IEnumerable<Domain.Entities.Files>>;

    public class GetTeachersFilesQueryHandler : IRequestHandler<GetTeachersFilesQuery, IEnumerable<Domain.Entities.Files>>
    {
        private readonly IFilesRepository _repository;

        public GetTeachersFilesQueryHandler(IFilesRepository repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<Domain.Entities.Files>> Handle(GetTeachersFilesQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetTeachersFilesAsync(request.TeacherID);
        }
    }
}
