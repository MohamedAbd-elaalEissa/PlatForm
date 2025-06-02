//using ApplicationContract.IFiles;
//using ApplicationContract.Models.File.AWS;
//using ApplicationContract.Models;
//using MediatR;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Application.Features.Files.Commands.AWS
//{
//    public record CompleteMultipartUploadCommand(CompleteUploadDto CompleteDto) : IRequest<CommonResult>;

//    public class CompleteMultipartUploadCommandHandler : IRequestHandler<CompleteMultipartUploadCommand, CommonResult>
//    {
//        private readonly IFilesRepository _repository;

//        public CompleteMultipartUploadCommandHandler(IFilesRepository repository)
//        {
//            _repository = repository;
//        }

//        public async Task<CommonResult> Handle(CompleteMultipartUploadCommand request, CancellationToken cancellationToken)
//        {
//            return await _repository.CompleteMultipartUpload(request.CompleteDto);
//        }
//    }
//}
