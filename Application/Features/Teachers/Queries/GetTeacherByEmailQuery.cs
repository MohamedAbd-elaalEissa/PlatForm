using ApplicationContract.ITeacher;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Teachers.Queries
{
    public record GetTeacherByEmailQuery(string Email) : IRequest<Domain.Entities.Teachers>;
    public class GetTeacherByEmailQueryHandler : IRequestHandler<GetTeacherByEmailQuery, Domain.Entities.Teachers>
    {
        private readonly ITeacherRepository _repository;

        public GetTeacherByEmailQueryHandler(ITeacherRepository repository)
        {
            _repository = repository;
        }

        public async Task<Domain.Entities.Teachers> Handle(GetTeacherByEmailQuery request, CancellationToken cancellationToken)
        {
            var teacher = await _repository.GetTeacherWithStudentsByEmailAsync(request.Email);
            return teacher;
        }
    }
}
