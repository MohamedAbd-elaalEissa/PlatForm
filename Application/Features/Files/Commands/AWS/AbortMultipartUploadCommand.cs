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
//    public record AbortMultipartUploadCommand(AbortUploadDto AbortDto) : IRequest<CommonResult>;

//    public class AbortMultipartUploadCommandHandler : IRequestHandler<AbortMultipartUploadCommand, CommonResult>
//    {
//        private readonly IFilesRepository _repository;

//        public AbortMultipartUploadCommandHandler(IFilesRepository repository)
//        {
//            _repository = repository;
//        }

//        public async Task<CommonResult> Handle(AbortMultipartUploadCommand request, CancellationToken cancellationToken)
//        {
//            return await _repository.AbortMultipartUpload(request.AbortDto);
//        }
//    }
//}
