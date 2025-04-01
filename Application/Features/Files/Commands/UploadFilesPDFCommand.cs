using ApplicationContract.IFiles;
using ApplicationContract.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Files.Commands
{
    public record UploadFilesPDFCommand(IFormFile file, int userId, int teacherID) :IRequest<CommonResult>;

    public class UploadFilesPDFCommandHandler : IRequestHandler<UploadFilesPDFCommand, CommonResult>
    {
        private readonly IFilesRepository _repository;

        public UploadFilesPDFCommandHandler(IFilesRepository repository)
        {
            _repository = repository;
        }

        public async Task<CommonResult> Handle(UploadFilesPDFCommand request, CancellationToken cancellationToken)
        {
            return await _repository.UploadFilePDF(request.file,request.userId,request.teacherID);
        }
    }


}
