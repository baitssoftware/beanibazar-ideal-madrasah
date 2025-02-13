'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, Download, ExternalLink, FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up worker from CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string;
  title: string;
}

export default function PDFViewer({ file, title }: PDFViewerProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    const checkPDFAvailability = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(file, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`PDF not found: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error('Error checking PDF availability:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    checkPDFAvailability();
  }, [file]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2">
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer border border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
              {loading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : error ? (
                <AlertCircle className="mr-2 text-red-500" />
              ) : (
                <FileText className="mr-2" />
              )}
              <span>
                {loading ? 'Loading PDF...' : error ? 'Failed to load PDF' : 'Click to view PDF'}
              </span>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full max-h-[90vh]">
            {loading ? (
              <div className="p-4 text-center">
                <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                <p>Loading PDF...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                <AlertCircle className="mx-auto mb-2" size={24} />
                <p>Failed to load PDF in the viewer. Please try the alternative options below.</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <Button onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={() => window.open(file, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-auto h-[80vh]">
                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) => {
                    console.error('Error loading PDF:', error.message);
                    setError(true);
                  }}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      className="mb-4"
                      width={800}
                    />
                  ))}
                </Document>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {loading
              ? 'Checking PDF availability...'
              : error
                ? 'Error loading PDF'
                : 'PDF ready for viewing'}
          </span>
          <Button
            onClick={handleDownload}
            disabled={loading || error}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
