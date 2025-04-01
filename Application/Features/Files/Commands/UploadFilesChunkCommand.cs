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
    public record UploadFilesChunkCommand([FromForm] FileChunkDto chunkDto) :IRequest<CommonResult>;

    public class UploadFilesChunkCommandHandler : IRequestHandler<UploadFilesChunkCommand, CommonResult>
    {
        private readonly IFilesRepository _repository;

        public UploadFilesChunkCommandHandler(IFilesRepository repository)
        {
            _repository = repository;
        }

        public async Task<CommonResult> Handle(UploadFilesChunkCommand request, CancellationToken cancellationToken)
        {
            return await _repository.UploadFileChunk(request.chunkDto);
        }
    }


}
