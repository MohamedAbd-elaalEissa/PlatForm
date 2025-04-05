using ApplicationContract.IFiles;
using ApplicationContract.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Files.Queries
{
    public record GetAllAcademicLevelsQuery:IRequest<IEnumerable<Domain.Entities.AcademicLevels>>;
    public class GetAllAcademicLevelsQueryHandler : IRequestHandler<GetAllAcademicLevelsQuery, IEnumerable<Domain.Entities.AcademicLevels>>
    {
        private readonly IFilesRepository _repository;

        public GetAllAcademicLevelsQueryHandler(IFilesRepository repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<Domain.Entities.AcademicLevels>> Handle(GetAllAcademicLevelsQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetAllAcademicLevelsAsync();
        }
    }
}
