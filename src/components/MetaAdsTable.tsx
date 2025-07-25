import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface MetaAdsData {
  campaign_name: string;
  adset_name: string;
  ad_name: string;
  status: string;
  impressions: number;
  reach: number;
  clicks: number;
  cpc: number;
  spend: number;
  date_start: string;
  date_stop: string;
}

interface MetaAdsTableProps {
  dados: MetaAdsData[];
  currentData: MetaAdsData[];
  camposSelecionados: string[];
  opcoesCampos: Array<{ value: string; label: string }>;
  sortField: keyof MetaAdsData;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof MetaAdsData) => void;
}

const MetaAdsTable = ({
  dados,
  currentData,
  camposSelecionados,
  opcoesCampos,
  sortField,
  sortDirection,
  onSort
}: MetaAdsTableProps) => {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      "ACTIVE": "bg-green-100 text-green-800",
      "PAUSED": "bg-yellow-100 text-yellow-800",
      "DELETED": "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="relative w-full">
      <div className="h-[600px] w-full overflow-auto border rounded-md bg-white dark:bg-gray-900">
      <Table className="min-w-full">
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            {camposSelecionados.map(campo => {
              const opcao = opcoesCampos.find(o => o.value === campo);
              return (
                <TableHead 
                  key={campo}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 w-[150px] min-w-[150px]"
                  onClick={() => onSort(campo as keyof MetaAdsData)}
                >
                  {opcao?.label || campo} {sortField === campo && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <TableRow key={index}>
                {camposSelecionados.map(campo => {
                  const valor = (item as any)[campo];
                  let valorFormatado = '-';
                  
                  if (valor !== undefined && valor !== null) {
                    if (campo === 'status') {
                      return (
                        <TableCell key={campo}>
                          {getStatusBadge(valor)}
                        </TableCell>
                      );
                    } else if (typeof valor === 'number') {
                      if (campo === 'ctr' || campo === 'frequency') {
                        valorFormatado = valor.toFixed(2) + '%';
                      } else if (campo === 'cpm' || campo === 'cpc') {
                        valorFormatado = 'R$ ' + valor.toFixed(2);
                      } else if (campo === 'spend') {
                        valorFormatado = 'R$ ' + valor.toFixed(2);
                      } else {
                        valorFormatado = valor.toLocaleString();
                      }
                    } else if (campo === 'date_start' || campo === 'date_stop') {
                      valorFormatado = format(new Date(valor), "dd/MM/yyyy");
                    } else {
                      valorFormatado = String(valor);
                    }
                  }
                  
                  return (
                    <TableCell key={campo} className={typeof valor === 'number' && campo !== 'status' ? "text-right" : ""}>
                      {valorFormatado}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={camposSelecionados.length} className="text-center py-8 text-gray-500">
                Nenhum dado encontrado. Clique em "Obter Dados" para importar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
};

export default MetaAdsTable;