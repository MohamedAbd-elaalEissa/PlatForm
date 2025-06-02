//using ApplicationContract.IFiles;
//using ApplicationContract.Models.File.AWS;
//using MediatR;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Application.Features.Files.Queries.AWS
//{
//    public record GetUploadProgressQuery(int UserId, string FileName) : IRequest<UploadProgressDto>;

//    public class GetUploadProgressQueryHandler : IRequestHandler<GetUploadProgressQuery, UploadProgressDto>
//    {
//        private readonly IFilesRepository _repository;

//        public GetUploadProgressQueryHandler(IFilesRepository repository)
//        {
//            _repository = repository;
//        }

//        public async Task<UploadProgressDto> Handle(GetUploadProgressQuery request, CancellationToken cancellationToken)
//        {
//            return await _repository.GetUploadProgress(request.UserId, request.FileName);
//        }
//    }
//}
