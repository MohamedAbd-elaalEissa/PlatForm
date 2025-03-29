using ApplicationContract.ITeacher;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Teachers.Queries
{
    public record GetTeacherWithStudentsQueries : IRequest<IEnumerable<Domain.Entities.Teachers>>;
    public class GetTeacherWithStudentsQueriesHandler : IRequestHandler<GetTeacherWithStudentsQueries, IEnumerable<Domain.Entities.Teachers>>
    {
        private readonly ITeacherRepository _repository;

        public GetTeacherWithStudentsQueriesHandler(ITeacherRepository repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<Domain.Entities.Teachers>> Handle(GetTeacherWithStudentsQueries request, CancellationToken cancellationToken)
        {
            var res = await _repository.GetAllTeacherWithInclude();
            return res;
        }
    }
}
