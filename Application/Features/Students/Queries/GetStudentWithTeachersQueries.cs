using ApplicationContract.IStudent;
using ApplicationContract.ITeacher;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Students.Queries
{
    public record GetStudentWithTeachersQueries : IRequest<IEnumerable<Domain.Entities.Students>>;
    public class GetStudentWithTeachersQueriesHandler : IRequestHandler<GetStudentWithTeachersQueries, IEnumerable<Domain.Entities.Students>>
    {
        private readonly IStudentRepository _repository;

        public GetStudentWithTeachersQueriesHandler(IStudentRepository repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<Domain.Entities.Students>> Handle(GetStudentWithTeachersQueries request, CancellationToken cancellationToken)
        {
            var res = await _repository.GetAllStudentWithInclude();
            return res;
        }
    }
}
