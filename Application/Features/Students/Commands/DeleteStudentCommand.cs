using Application.Exceptions;
using ApplicationContract.IStudent;
using MediatR;

namespace Application.Features.Students.Commands
{
    public record DeleteStudentCommand(int StudentID) : IRequest<Unit>;
    public class DeleteStudentCommandHandler : IRequestHandler<DeleteStudentCommand, Unit>
    {
        private readonly IStudentRepository _repository;

        public DeleteStudentCommandHandler(IStudentRepository repository)
        {
            _repository = repository;
        }
        public async Task<Unit> Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
        {
            var _old = await _repository.GetAsync(request.StudentID);
            if (_old == null) throw new NotFoundException("Student not found");
            await _repository.DeleteAsync(request.StudentID);
            return Unit.Value;
        }
    }
}
