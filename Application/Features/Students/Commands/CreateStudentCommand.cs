using Application.Exceptions;
using Application.Features.Students.Validators;
using ApplicationContract.IStudent;
using ApplicationContract.Models;
using Mapster;
using MediatR;

namespace Application.Features.Students.Commands
{
    public record CreateStudentCommand(StudentDTO Student) : IRequest<Unit>;
    public class CreateStudentCommandHandler : IRequestHandler<CreateStudentCommand, Unit>
    {
        private readonly IStudentRepository _repository;
        public CreateStudentCommandHandler(IStudentRepository repository)
        {
            _repository = repository;
        }
        public async Task<Unit> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
        {

            var validator = new CreateStudentValidators();
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid) throw new ValidaionException(validationResult);
            var student = request.Student.Adapt<Domain.Entities.Students>();//Create a new object from a source	
            await _repository.CreateAsync(student);
            return Unit.Value;
        }
    }




}
