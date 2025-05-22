using Application.Exceptions;
using Application.Teacher.Features.Teachers.Validators;
using ApplicationContract.ITeacher;
using ApplicationContract.Models;
using Mapster;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Teachers.Commands
{
    public record UpdateTeacherCommand(TeacherDTO Teacher) : IRequest<Unit>;

    public class UpdateTeacherCommandHandler : IRequestHandler<UpdateTeacherCommand, Unit>
    {
        private readonly ITeacherRepository _repository;

        public UpdateTeacherCommandHandler(ITeacherRepository repository)
        {
            _repository = repository;
        }
        public async Task<Unit> Handle(UpdateTeacherCommand request, CancellationToken cancellationToken)
        {
            var validator = new UpdateTeacherValidators();
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid) throw new ValidaionException(validationResult);

            var _old=await _repository.GetAsync(request.Teacher.TeacherID);
            if (_old == null) throw new NotFoundException("Teacher not found");
            var teacher = request.Teacher.Adapt(_old);// Update an existing object (EF-safe)
            await _repository.UpdateAsync(teacher);
            return Unit.Value;
        }
    }
}
