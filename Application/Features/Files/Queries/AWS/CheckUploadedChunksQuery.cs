//using ApplicationContract.IFiles;
//using ApplicationContract.Models.File;
//using MediatR;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Application.Features.Files.Queries.AWS
//{
//    public record CheckUploadedChunksQuery(int UserId, string FileName, string UploadId) : IRequest<ChunkStatusDto>;

//    public class CheckUploadedChunksQueryHandler : IRequestHandler<CheckUploadedChunksQuery, ChunkStatusDto>
//    {
//        private readonly IFilesRepository _repository;

//        public CheckUploadedChunksQueryHandler(IFilesRepository repository)
//        {
//            _repository = repository;
//        }

//        public async Task<ChunkStatusDto> Handle(CheckUploadedChunksQuery request, CancellationToken cancellationToken)
//        {
//            return await _repository.CheckUploadedChunks(request.UserId, request.FileName, request.UploadId);
//        }
//    }
//}
