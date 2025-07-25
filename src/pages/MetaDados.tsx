import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, Filter, Search, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ProductLayout } from '@/components/ProductLayout';
import { useToast } from "@/components/ui/use-toast";
import { getContas, ContaAPI } from '@/services/integrations';
import { getAllFacebookUsers, FacebookUser } from '@/services/oauth';

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

interface Usuario {
  id: number;
  nome: string;
}

const MetaDados = () => {
  const [dados, setDados] = useState<MetaAdsData[]>([]);
  const [filteredData, setFilteredData] = useState<MetaAdsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataInicial, setDataInicial] = useState<Date>();
  const [dataFinal, setDataFinal] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof MetaAdsData>("campaign_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [usuarios, setUsuarios] = useState<FacebookUser[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<string>("");
  const [contas, setContas] = useState<ContaAPI[]>([]);
  const [contaSelecionada, setContaSelecionada] = useState<string>("");
  const camposObrigatorios = [
    "campaign_name", "adset_name", "ad_name", "impressions", "reach", "clicks", "cpc", "spend", "ad_id"
  ];
  const [camposSelecionados, setCamposSelecionados] = useState<string[]>(camposObrigatorios);

  const opcoesCampos = [
    { value: "campaign_name", label: "Nome da Campanha" },
    { value: "adset_name", label: "Conjunto" },
    { value: "ad_name", label: "Anúncio" },
    { value: "impressions", label: "Impressões" },
    { value: "reach", label: "Alcance" },
    { value: "clicks", label: "Cliques" },
    { value: "cpc", label: "CPC" },
    { value: "spend", label: "Gasto" },
    { value: "ctr", label: "CTR" },
    { value: "cpm", label: "CPM" },
    { value: "frequency", label: "Frequência" },
    { value: "actions", label: "Ações" },
    { value: "objective", label: "Objetivo" },
    { value: "configured_status", label: "Status Configurado" },
    { value: "effective_status", label: "Status Efetivo" },
    { value: "ad_id", label: "ID do Anúncio" }
  ];
  const { toast } = useToast();

  const itemsPerPage = 10;

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        // Buscar usuários reais do OAuth
        const usuariosData = await getAllFacebookUsers();
        
        // Buscar contas do banco usando o serviço existente
        const contasData = await getContas();
        
        // Filtrar apenas contas Meta/Facebook Ads ativas
        const contasMeta = contasData.filter(c => 
          ["Meta Ads", "Facebook Ads"].includes(c.plataforma) && c.ativo
        );

        setUsuarios(usuariosData);
        setContas(contasMeta);

        // Seleciona automaticamente o primeiro usuário e conta
        if (usuariosData.length > 0) {
          setUsuarioSelecionado(usuariosData[0].facebook_id || "");
        }
        if (contasMeta.length > 0) {
          setContaSelecionada(contasMeta[0].identificador_conta);
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados iniciais.",
        });
      }
    };

    carregarDadosIniciais();
  }, [toast]);

  // Filtrar e ordenar dados
  useEffect(() => {
    let filtered = dados.filter(item =>
      item.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.adset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ad_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenação
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [dados, searchTerm, sortField, sortDirection]);

  const obterDados = async () => {
    if (!usuarioSelecionado || !contaSelecionada) {
      toast({
        variant: "destructive",
        title: "Seleção obrigatória",
        description: "Por favor, selecione um usuário e uma conta.",
      });
      return;
    }

    setLoading(true);
    try {
      const request: any = {
        facebook_id: usuarioSelecionado,
        account_id: contaSelecionada,
        fields: camposSelecionados.length > 0 ? camposSelecionados.join(",") : undefined
      };
      if (dataInicial && dataFinal) {
        request.data_inicial = format(dataInicial, "yyyy-MM-dd");
        request.data_final = format(dataFinal, "yyyy-MM-dd");
      }

      const response = await fetch("http://localhost:8000/api/v1/meta/dados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.erro) {
          toast({
            variant: "destructive",
            title: "Erro ao carregar dados",
            description: result.erro,
          });
          return;
        }

        setDados(result.dados || []);
        toast({
          title: "Dados carregados",
          description: `${result.dados?.length || 0} registros obtidos com sucesso.`,
        });
      } else {
        // Dados mock para demonstração em caso de erro
        const dadosMock = [
          {
            campaign_name: "Campanha Black Friday",
            adset_name: "Conjunto Produtos",
            ad_name: "Anúncio Desconto 50%",
            status: "ACTIVE",
            impressions: 15420,
            reach: 12350,
            clicks: 324,
            cpc: 0.75,
            spend: 243.00,
            date_start: "2025-07-01",
            date_stop: "2025-07-13"
          },
          {
            campaign_name: "Campanha Verão",
            adset_name: "Conjunto Roupas",
            ad_name: "Anúncio Coleção Verão",
            status: "PAUSED",
            impressions: 8950,
            reach: 7200,
            clicks: 156,
            cpc: 1.20,
            spend: 187.20,
            date_start: "2025-07-01",
            date_stop: "2025-07-13"
          }
        ];
        
        setDados(dadosMock);
        toast({
          title: "Dados mock carregados",
          description: `${dadosMock.length} registros de demonstração carregados.`,
        });
      }
    } catch (error) {
      console.error("Erro ao obter dados:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof MetaAdsData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

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
    <ProductLayout title="Dados da Meta Ads">
      <div className="space-y-6">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize os dados brutos das suas campanhas importadas da Meta Ads.
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Primeira linha: Usuário, Conta, Datas, Campos e Botão */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Seleção de Usuário */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Usuário Logado
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                    value={usuarioSelecionado}
                    onChange={(e) => setUsuarioSelecionado(e.target.value)}
                  >
                    {usuarios.map((usuario) => (
                      <option key={usuario.facebook_id} value={usuario.facebook_id}>
                        {usuario.username}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown de Contas Meta Ads */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Conta Meta Ads
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                    value={contaSelecionada}
                    onChange={(e) => setContaSelecionada(e.target.value)}
                  >
                    {contas.map((conta) => (
                      <option key={conta.id} value={conta.identificador_conta}>
                        {conta.nome_conta}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data Inicial */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Data Inicial
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataInicial && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataInicial ? format(dataInicial, "dd/MM/yyyy") : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataInicial}
                        onSelect={setDataInicial}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Data Final */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Data Final
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataFinal && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataFinal ? format(dataFinal, "dd/MM/yyyy") : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataFinal}
                        onSelect={setDataFinal}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Campos a puxar */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Campos a puxar
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        {camposSelecionados.length > 0 
                          ? `${camposSelecionados.length} campo${camposSelecionados.length > 1 ? 's' : ''} selecionado${camposSelecionados.length > 1 ? 's' : ''}`
                          : "Selecionar campos"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 z-50" align="start">
                      <div className="bg-background border border-border rounded-lg shadow-lg">
                        <div className="p-3 border-b">
                          <h4 className="font-medium text-sm">Selecione os campos para extrair</h4>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-2">
                          {opcoesCampos
                            .sort((a, b) => {
                              const aObrigatorio = camposObrigatorios.includes(a.value);
                              const bObrigatorio = camposObrigatorios.includes(b.value);
                              if (aObrigatorio && !bObrigatorio) return -1;
                              if (!aObrigatorio && bObrigatorio) return 1;
                              return a.label.localeCompare(b.label);
                            })
                            .map((campo) => (
                            <label
                              key={campo.value}
                              className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                            >
                              <Checkbox
                                checked={camposSelecionados.includes(campo.value)}
                                disabled={camposObrigatorios.includes(campo.value)}
                                onCheckedChange={checked => {
                                  if (camposObrigatorios.includes(campo.value)) {
                                    if (!checked) {
                                      toast({
                                        variant: "destructive",
                                        title: "Campo obrigatório",
                                        description: `O campo '${campo.label}' é obrigatório e não pode ser desmarcado.`,
                                      });
                                    }
                                    return;
                                  }
                                  if (checked) {
                                    setCamposSelecionados([...camposSelecionados, campo.value]);
                                  } else {
                                    setCamposSelecionados(camposSelecionados.filter(c => c !== campo.value));
                                  }
                                }}
                                id={`campo-${campo.value}`}
                              />
                              <span className="text-sm">{campo.label}{camposObrigatorios.includes(campo.value) && <span className="text-red-500 ml-1">*</span>}</span>
                            </label>
                          ))}
                        </div>
                        <div className="p-3 border-t flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCamposSelecionados(opcoesCampos.map(c => c.value))}
                            className="flex-1"
                          >
                            Selecionar Todos
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCamposSelecionados(camposObrigatorios)}
                            className="flex-1"
                          >
                            Limpar Todos
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Botão Obter Dados */}
                <div className="flex items-end">
                  <Button 
                    onClick={obterDados} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Obter Dados
                  </Button>
                </div>
              </div>

              {/* Segunda linha: Busca */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nome da campanha, conjunto ou anúncio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 min-w-[180px]"
                      onClick={() => handleSort("campaign_name")}
                    >
                      Nome da Campanha {sortField === "campaign_name" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 min-w-[150px]"
                      onClick={() => handleSort("adset_name")}
                    >
                      Conjunto {sortField === "adset_name" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 min-w-[150px]"
                      onClick={() => handleSort("ad_name")}
                    >
                      Anúncio {sortField === "ad_name" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-right min-w-[100px]"
                      onClick={() => handleSort("impressions")}
                    >
                      Impressões {sortField === "impressions" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-right min-w-[100px]"
                      onClick={() => handleSort("reach")}
                    >
                      Alcance {sortField === "reach" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-right min-w-[80px]"
                      onClick={() => handleSort("clicks")}
                    >
                      Cliques {sortField === "clicks" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-right min-w-[80px]"
                      onClick={() => handleSort("cpc")}
                    >
                      CPC {sortField === "cpc" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-right min-w-[80px]"
                      onClick={() => handleSort("spend")}
                    >
                      Gasto {sortField === "spend" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    {/* Colunas dos campos opcionais - só mostrar se existirem dados */}
                    {camposSelecionados
                      .filter(campo => {
                        // Não mostrar campos já incluídos nas colunas fixas
                        if (["campaign_name", "adset_name", "ad_name", "impressions", "reach", "clicks", "cpc", "spend", "date_start", "date_stop"].includes(campo)) {
                          return false;
                        }
                        // Só mostrar se pelo menos um item tem esse campo
                        return dados.length > 0 && dados.some(item => (item as any)[campo] !== undefined && (item as any)[campo] !== null);
                      })
                      .map(campo => {
                        const opcao = opcoesCampos.find(o => o.value === campo);
                        return (
                          <TableHead 
                            key={campo}
                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-right min-w-[100px]"
                            onClick={() => handleSort(campo as keyof MetaAdsData)}
                          >
                            {opcao?.label} {sortField === campo && (sortDirection === "asc" ? "↑" : "↓")}
                          </TableHead>
                        );
                      })
                    }
                    <TableHead className="min-w-[100px]">Data Início</TableHead>
                    <TableHead className="min-w-[100px]">Data Fim</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.campaign_name}</TableCell>
                        <TableCell>{item.adset_name}</TableCell>
                        <TableCell>{item.ad_name}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right">{item.impressions?.toLocaleString() || '-'}</TableCell>
                        <TableCell className="text-right">{item.reach?.toLocaleString() || '-'}</TableCell>
                        <TableCell className="text-right">{item.clicks?.toLocaleString() || '-'}</TableCell>
                        <TableCell className="text-right">R$ {item.cpc?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell className="text-right">R$ {item.spend?.toFixed(2) || '0.00'}</TableCell>
                        {/* Células dos campos opcionais - só se existirem dados */}
                        {camposSelecionados
                          .filter(campo => {
                            if (["campaign_name", "adset_name", "ad_name", "impressions", "reach", "clicks", "cpc", "spend", "date_start", "date_stop"].includes(campo)) {
                              return false;
                            }
                            return dados.length > 0 && dados.some(item => (item as any)[campo] !== undefined && (item as any)[campo] !== null);
                          })
                          .map(campo => {
                            const valor = (item as any)[campo];
                            let valorFormatado = '-';
                            
                            if (valor !== undefined && valor !== null) {
                              if (typeof valor === 'number') {
                                if (campo === 'ctr' || campo === 'frequency') {
                                  valorFormatado = valor.toFixed(2) + '%';
                                } else if (campo === 'cpm') {
                                  valorFormatado = 'R$ ' + valor.toFixed(2);
                                } else {
                                  valorFormatado = valor.toLocaleString();
                                }
                              } else {
                                valorFormatado = String(valor);
                              }
                            }
                            
                            return (
                              <TableCell key={campo} className="text-right">
                                {valorFormatado}
                              </TableCell>
                            );
                          })
                        }
                        <TableCell>{format(new Date(item.date_start), "dd/MM/yyyy")}</TableCell>
                        <TableCell>{format(new Date(item.date_stop), "dd/MM/yyyy")}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={100} className="text-center py-8 text-gray-500">
                        Nenhum dado encontrado. Clique em "Obter Dados" para importar.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredData.length > 0 && (
                 <div className="px-4 py-2 text-sm text-muted-foreground flex justify-end">
                    Mostrando {startIndex + 1}–{Math.min(endIndex, filteredData.length)} de {filteredData.length} campanhas
                 </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </ProductLayout>
  );
};

export default MetaDados;