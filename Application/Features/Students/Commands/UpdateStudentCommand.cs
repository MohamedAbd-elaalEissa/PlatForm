using Application.Exceptions;
using Application.Features.Students.Validators;
using ApplicationContract.IStudent;
using ApplicationContract.Models;
using Mapster;
using MediatR;

namespace Application.Features.Students.Commands
{
    public record UpdateStudentCommand(StudentDTO Student) : IRequest<Unit>;

    public class UpdateStudentCommandHandler : IRequestHandler<UpdateStudentCommand, Unit>
    {
        private readonly IStudentRepository _repository;

        public UpdateStudentCommandHandler(IStudentRepository repository)
        {
            _repository = repository;
        }
        public async Task<Unit> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
        {
            var validator = new UpdateStudentValidators();
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid) throw new ValidaionException(validationResult);
            var _old = await _repository.GetAsync(request.Student.StudentID);
            if (_old == null) throw new NotFoundException("Student not found");
            var student = request.Student.Adapt(_old);// Update an existing object (EF-safe)
            await _repository.UpdateAsync(student);
            return Unit.Value;
        }
    }
}
