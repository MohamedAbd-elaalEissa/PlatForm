using ApplicationContract.IFiles;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Files.Queries
{
    public record StreamVideoQuery(string FileName, HttpRequest Request) : IRequest<IActionResult>;
    public class StreamVideoQueryHandler : IRequestHandler<StreamVideoQuery, IActionResult>
    {
        private readonly IFilesRepository _filesRepository;

        public StreamVideoQueryHandler(IFilesRepository filesRepository)
        {
            _filesRepository = filesRepository;
        }

        public async Task<IActionResult> Handle(StreamVideoQuery request, CancellationToken cancellationToken)
        {
            return await _filesRepository.GetVideoStreamAsync(request.FileName, request.Request);
        }
    }
}
