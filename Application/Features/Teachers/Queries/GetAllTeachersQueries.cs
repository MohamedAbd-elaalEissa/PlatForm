using ApplicationContract.ITeacher;
using MediatR;

namespace Application.Features.Teachers.Queries
{
    public record GetAllTeachersQueries : IRequest<IReadOnlyList<Domain.Entities.Teachers>>;


    public class GetAllTeachersQueriesHandler : IRequestHandler<GetAllTeachersQueries, IReadOnlyList<Domain.Entities.Teachers>>
    {
        private readonly ITeacherRepository _repository;

        public GetAllTeachersQueriesHandler(ITeacherRepository repository)
        {
            _repository = repository;
        }
        public async Task<IReadOnlyList<Domain.Entities.Teachers>> Handle(GetAllTeachersQueries request, CancellationToken cancellationToken)
        {
            var res = await _repository.GetAllAsync();
            return res ;
        }
    }
}
