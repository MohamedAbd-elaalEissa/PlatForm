using ApplicationContract.IStudent;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Students.Queries
{
    public record GetStudentWithEmailQueries(string email) : IRequest<Domain.Entities.Students>;
    public class GetStudentWithEmailQueriesHandler : IRequestHandler<GetStudentWithEmailQueries,Domain.Entities.Students>
    {
        private readonly IStudentRepository _repository;

        public GetStudentWithEmailQueriesHandler(IStudentRepository repository)
        {
            _repository = repository;
        }
        public async Task<Domain.Entities.Students> Handle(GetStudentWithEmailQueries request, CancellationToken cancellationToken)
        {
            var res = await _repository.GetStudentWithEmail(request.email);
            return res;
        }
    }

}
