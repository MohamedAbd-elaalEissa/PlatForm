using Application.Exceptions;
using ApplicationContract.ITeacher;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Teachers.Commands
{
    public record DeleteTeacherCommand(int TeacherID):IRequest<Unit>;
    public class DeleteTeacherCommandHandler : IRequestHandler<DeleteTeacherCommand, Unit>
    {
        private readonly ITeacherRepository _repository;

        public DeleteTeacherCommandHandler(ITeacherRepository repository)
        {
            _repository = repository;
        }
        public async Task<Unit> Handle(DeleteTeacherCommand request, CancellationToken cancellationToken)
        {
            var _old = await _repository.GetAsync(request.TeacherID);
            if (_old == null) throw new NotFoundException("Teacher not found");
            await _repository.DeleteAsync(request.TeacherID);
            return Unit.Value;
        }
    }
}
