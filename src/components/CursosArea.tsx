import React, { useState } from "react";
import ContentViewer from "./ContentViewer";
import { Button } from "./ui/button";

// Dentro do componente com a árvore de cursos
const CursosArea: React.FC = () => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selected, setSelected] = useState<{
    type: "pdf" | "markdown" | "video";
    url: string;
    title: string;
  } | null>(null);

  const handleSelect = (item: {
    type: "pdf" | "markdown" | "video";
    url: string;
    title: string;
  }) => {
    setSelected(item);
    setViewerOpen(true);
  };

  return (
    <div>
      {/* Aqui vai sua árvore, exemplo: */}
      <div className="space-y-2">
        <Button
          onClick={() =>
            handleSelect({
              type: "markdown",
              url: "/cursos/curso1/mat1/resumo.md",
              title: "Resumo Matéria 1",
            })
          }
        >
          Ver Resumo Mat1
        </Button>
        <Button
          onClick={() =>
            handleSelect({
              type: "pdf",
              url: "/cursos/curso1/mat1/doc.pdf",
              title: "Documento Matéria 1",
            })
          }
        >
          Ver PDF Mat1
        </Button>
        <Button
          onClick={() =>
            handleSelect({
              type: "video",
              url: "https://domain.com/video.mp4",
              title: "Vídeo Aula 1",
            })
          }
        >
          Ver Vídeo Mat1
        </Button>
      </div>

      {viewerOpen && selected && (
        <ContentViewer
          type={selected.type}
          fileUrl={selected.url}
          title={selected.title}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default CursosArea;
