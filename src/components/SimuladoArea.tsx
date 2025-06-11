// src/components/SimuladoArea.tsx
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const SimuladoArea: React.FC = () => {
  const simulados = [
    /* sua lista */
  ];

  return (
    <div className="simple-grid simple-grid-2 gap-6">
      {simulados.map((sim) => (
        <Card key={sim.id} className="hover:shadow-lg">
          <CardHeader>
            <CardTitle>{sim.titulo}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{sim.descricao}</p>
            <div className="mt-4">
              <Button onClick={() => iniciarSimulado(sim.id)}>
                Iniciar Simulado
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SimuladoArea;
