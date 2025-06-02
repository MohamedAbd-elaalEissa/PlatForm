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
//    public record InitializeMultipartUploadCommand(InitiateUploadDto UploadDto) : IRequest<CommonResult>;

//    public class InitializeMultipartUploadCommandHandler : IRequestHandler<InitializeMultipartUploadCommand, CommonResult>
//    {
//        private readonly IFilesRepository _repository;

//        public InitializeMultipartUploadCommandHandler(IFilesRepository repository)
//        {
//            _repository = repository;
//        }

//        public async Task<CommonResult> Handle(InitializeMultipartUploadCommand request, CancellationToken cancellationToken)
//        {
//            return await _repository.InitializeMultipartUpload(request.UploadDto);
//        }
//    }
//}
