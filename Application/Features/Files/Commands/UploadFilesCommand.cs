using ApplicationContract.IFiles;
using ApplicationContract.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Files.Commands
{
    public record UploadFilesCommand(IFormFile File,int UserID):IRequest<CommonResult>;

    public class UploadFilesCommandHandler:IRequestHandler<UploadFilesCommand, CommonResult>
    {
        private readonly IFilesRepository _repository;

        public UploadFilesCommandHandler(IFilesRepository repository)
        {
            _repository = repository;
        }

        public Task<CommonResult> Handle(UploadFilesCommand request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }


}
