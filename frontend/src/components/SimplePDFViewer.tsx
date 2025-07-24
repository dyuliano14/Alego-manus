import React from 'react';

interface SimplePDFViewerProps {
  url: string;
  width?: string;
  height?: string;
}

const SimplePDFViewer: React.FC<SimplePDFViewerProps> = ({ 
  url, 
  width = "100%", 
  height = "600px" 
}) => {
  return (
    <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden">
      <iframe
        src={url}
        width={width}
        height={height}
        className="w-full h-full"
        title="PDF Viewer"
      />
    </div>
  );
};

export default SimplePDFViewer;
