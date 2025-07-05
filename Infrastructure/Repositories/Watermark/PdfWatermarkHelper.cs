using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using PdfSharpCore.Drawing;

public static class PdfWatermarkHelper
{
    public static byte[] AddTextWatermark(Stream inputPdfStream, string watermarkText)
    {
        using var outputStream = new MemoryStream();
        var document = PdfReader.Open(inputPdfStream, PdfDocumentOpenMode.Modify);

        // نوع الخط والحجم
        var font = new XFont("Arial", 40, XFontStyle.Bold);

        foreach (var page in document.Pages)
        {
            // نستخدم Append علشان العلامة المائية تبقى فوق النص
            using var gfx = XGraphics.FromPdfPage(page, XGraphicsPdfPageOptions.Append);

            // لون شفاف
            var brush = new XSolidBrush(XColor.FromArgb(60, 100, 100, 100)); // رمادي شبه شفاف

            double spacingX = 200;
            double spacingY = 150;

            for (double y = 0; y < page.Height; y += spacingY)
            {
                for (double x = 0; x < page.Width; x += spacingX)
                {
                    gfx.TranslateTransform(x, y);
                    gfx.RotateTransform(-30); // مائل
                    gfx.DrawString(watermarkText, font, brush, 0, 0);
                    gfx.RotateTransform(30);
                    gfx.TranslateTransform(-x, -y);
                }
            }
        }

        document.Save(outputStream);
        return outputStream.ToArray();
    }


}
