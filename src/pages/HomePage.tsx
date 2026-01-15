import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Search, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { Dispute } from '@shared/types';
import { formatCurrency, formatDate } from '@/lib/formatting';
import { toast } from 'sonner';
export function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['disputes'],
    queryFn: () => api<{ items: Dispute[] }>('/api/disputes'),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/disputes/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      toast.success("Dispute deleted");
    }
  });
  const disputes = data?.items || [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
              <span className="font-bold tracking-tight">CLAIMSHIELD</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Medical Billing Disputes</h1>
            <p className="text-muted-foreground">Manage and generate forensic dispute letters for medical billing errors.</p>
          </div>
          <Button onClick={() => navigate('/disputes/new')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> New Dispute Case
          </Button>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Cases</CardDescription>
              <CardTitle className="text-2xl">{disputes.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Billed</CardDescription>
              <CardTitle className="text-2xl text-red-600">
                {formatCurrency(disputes.reduce((acc, d) => acc + d.billedAmount, 0))}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Variance</CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {disputes.length > 0 
                  ? `${(disputes.reduce((acc, d) => acc + d.variancePercent, 0) / disputes.length).toFixed(1)}%` 
                  : '0%'}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        {/* List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Cases</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patient or ref..." className="pl-8" />
            </div>
          </div>
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">Loading cases...</div>
          ) : disputes.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-xl space-y-4">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <div className="space-y-1">
                <p className="font-medium text-lg">No dispute cases found</p>
                <p className="text-muted-foreground">Start by creating your first forensic medical billing dispute.</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/disputes/new')}>
                Get Started
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {disputes.map((dispute) => (
                <Card key={dispute.id} className="group hover:border-blue-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{dispute.patientName}</h3>
                          <Badge variant="secondary" className="text-[10px] h-5">{dispute.patientHash}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{dispute.providerName} • {formatDate(dispute.dateOfService)}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-red-600"
                          onClick={() => deleteMutation.mutate(dispute.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          onClick={() => navigate(`/disputes/${dispute.id}`)}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Billed Amount</div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(dispute.billedAmount)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Variance</div>
                        <div className="font-semibold text-red-600">
                          {dispute.variancePercent.toFixed(1)}% Over FMV
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}