using ApplicationContract.IFiles;
using ApplicationContract.Models;
using ApplicationContract.Models.File;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Files.Queries
{
    public record GetVideoFileQuery(string FileName) : IRequest<string>;

    public class GetVideoFileQueryHandler : IRequestHandler<GetVideoFileQuery, string>
    {
        private readonly IFilesRepository _filesRepository;

        public GetVideoFileQueryHandler(IFilesRepository videoService)
        {
            _filesRepository = videoService;
        }

        public async Task<string> Handle(GetVideoFileQuery request, CancellationToken cancellationToken)
        {
            var stream = await _filesRepository.GetVideoFileStreamAsync(request.FileName);

            return stream;//تحديد نوع الفديو ايلي راجه
        }
    }

}
