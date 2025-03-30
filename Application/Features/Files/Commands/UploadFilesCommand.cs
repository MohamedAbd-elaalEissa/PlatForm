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
    public record UploadFilesCommand([FromForm] FileChunkDto chunkDto) :IRequest<CommonResult>;

    public class UploadFilesCommandHandler:IRequestHandler<UploadFilesCommand, CommonResult>
    {
        private readonly IFilesRepository _repository;

        public UploadFilesCommandHandler(IFilesRepository repository)
        {
            _repository = repository;
        }

        public async Task<CommonResult> Handle(UploadFilesCommand request, CancellationToken cancellationToken)
        {
            return await _repository.UploadFileChunk(request.chunkDto);
        }
    }


}
