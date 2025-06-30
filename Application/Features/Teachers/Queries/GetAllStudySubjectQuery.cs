using ApplicationContract.IFiles;
using ApplicationContract.ITeacher;
using ApplicationContract.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Teachers.Queries
{
    public record GetAllStudySubjectQuery:IRequest<IEnumerable<Domain.Entities.Subjects>>;
    public class GetAllStudySubjectQueryHandler : IRequestHandler<GetAllStudySubjectQuery, IEnumerable<Domain.Entities.Subjects>>
    {
        private readonly ITeacherRepository _repository;

        public GetAllStudySubjectQueryHandler(ITeacherRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Domain.Entities.Subjects>> Handle(GetAllStudySubjectQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetAllStudySubjectsAsync();
        }
    }
}
