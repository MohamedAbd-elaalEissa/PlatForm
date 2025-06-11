using ApplicationContract.IFiles;
using ApplicationContract.Models.File;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Files.Queries
{
    public record DownloadFileQuery(string FileName, bool isBook) : IRequest<FileDto>;
    public class DownloadFileQueryHandler : IRequestHandler<DownloadFileQuery, FileDto>
    {
        private readonly IFilesRepository _repository;

        public DownloadFileQueryHandler(IFilesRepository repository)
        {
            _repository = repository;
        }

        public async Task<FileDto> Handle(DownloadFileQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetFileAsync(request.FileName,request.isBook);
        }
    }

}
