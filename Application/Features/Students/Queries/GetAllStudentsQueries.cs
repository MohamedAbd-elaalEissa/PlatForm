using ApplicationContract.IStudent;
using MediatR;

namespace Application.Features.Students.Queries
{
    public record GetAllStudentsQueries : IRequest<IReadOnlyList<Domain.Entities.Students>>;
    public class GetAllStudentsQueriesHandler : IRequestHandler<GetAllStudentsQueries, IReadOnlyList<Domain.Entities.Students>>
    {
        private readonly IStudentRepository _repository;

        public GetAllStudentsQueriesHandler(IStudentRepository repository)
        {
            _repository = repository;
        }
        public async Task<IReadOnlyList<Domain.Entities.Students>> Handle(GetAllStudentsQueries request, CancellationToken cancellationToken)
        {
            var res = await _repository.GetAllAsync();
            return res;
        }
    }
}
