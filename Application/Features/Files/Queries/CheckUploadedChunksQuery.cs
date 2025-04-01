using ApplicationContract.IFiles;
using ApplicationContract.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Files.Queries
{
    public record CheckUploadedChunksQuery(int userId, string fileName) :IRequest<ChunkStatusDto>;
    
    public class CheckUploadedChunksQueryhandler : IRequestHandler<CheckUploadedChunksQuery, ChunkStatusDto>
    {
        private readonly IFilesRepository _repository;

        public CheckUploadedChunksQueryhandler(IFilesRepository repository)
        {
            _repository = repository;
        }
        public async Task<ChunkStatusDto> Handle(CheckUploadedChunksQuery request, CancellationToken cancellationToken)
        {
            return await _repository.CheckUploadedChunks(request.userId, request.fileName);
        }
    }
}
