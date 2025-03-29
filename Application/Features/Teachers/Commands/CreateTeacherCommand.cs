using Application.Exceptions;
using Application.Teacher.Features.Teachers.Validators;
using ApplicationContract.ITeacher;
using ApplicationContract.Models;
using Mapster;
using MediatR;

namespace Application.Features.Teachers.Commands
{

    public record CreateTeacherCommand(TeacherDTO Teacher) : IRequest<Unit>;
    public class CreateTeacherCommandHandler : IRequestHandler<CreateTeacherCommand, Unit>
    {
        private readonly ITeacherRepository _repository;
        public CreateTeacherCommandHandler(ITeacherRepository repository)
        {
            _repository = repository;
        }
        public async Task<Unit> Handle(CreateTeacherCommand request, CancellationToken cancellationToken)
        {
            var validator = new CreateTeacherValidators();
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid) throw new ValidaionException(validationResult);
            var teacher = request.Teacher.Adapt<Domain.Entities.Teachers>();//Create a new object from a source	
            await _repository.CreateAsync(teacher);
            return Unit.Value;
        }
    }


}
