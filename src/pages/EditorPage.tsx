import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import { ChevronLeft, Save, Printer, Calculator, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LetterPreview } from '@/components/LetterPreview';
import { Dispute } from '@shared/types';
import { api } from '@/lib/api-client';
import { calculateVariance } from '@/lib/formatting';
import { toast } from 'sonner';
export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const letterRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, watch, setValue, reset } = useForm<Dispute>({
    defaultValues: {
      patientName: '',
      patientHash: '',
      statute: 'No Surprises Act (45 CFR § 149.410)',
      cptCode: '',
      billedAmount: 0,
      fmvAmount: 0,
      providerName: '',
      dateOfService: new Date().toISOString().split('T')[0],
    }
  });
  const formData = watch();
  useEffect(() => {
    if (id && id !== 'new') {
      api<Dispute>(`/api/disputes/${id}`).then(reset).catch(() => {
        toast.error("Failed to load dispute");
        navigate('/');
      });
    }
  }, [id, reset, navigate]);
  // Real-time variance calculation
  useEffect(() => {
    const { variance, variancePercent } = calculateVariance(formData.billedAmount || 0, formData.fmvAmount || 0);
    setValue('variance', variance);
    setValue('variancePercent', variancePercent);
  }, [formData.billedAmount, formData.fmvAmount, setValue]);
  const onPrint = useReactToPrint({
    content: () => letterRef.current,
    documentTitle: `Dispute_${formData.patientName}_${formData.cptCode}`,
  });
  const onSave = async (data: Dispute) => {
    try {
      await api<Dispute>('/api/disputes', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success("Dispute saved successfully");
      navigate('/');
    } catch (err) {
      toast.error("Failed to save dispute");
    }
  };
  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b bg-background flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="h-4 w-[1px] bg-border" />
          <h1 className="font-semibold text-sm">
            {id === 'new' ? 'New Dispute' : `Editing: ${formData.patientName || 'Dispute'}`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="w-4 h-4 mr-2" /> Print PDF
          </Button>
          <Button size="sm" onClick={handleSubmit(onSave)}>
            <Save className="w-4 h-4 mr-2" /> Save Case
          </Button>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Form Panel */}
        <div className="w-[400px] border-r bg-background overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" /> Patient Info
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Patient Full Name</Label>
                <Input {...register('patientName')} placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label>Reference Hash / ID</Label>
                <Input {...register('patientHash')} placeholder="REF-001" />
              </div>
              <div className="space-y-2">
                <Label>Date of Service</Label>
                <Input type="date" {...register('dateOfService')} />
              </div>
              <div className="space-y-2">
                <Label>Provider / Facility</Label>
                <Input {...register('providerName')} placeholder="General Hospital" />
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider">
              <Calculator className="w-4 h-4" /> Forensic Data
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>CPT Code</Label>
                <Input {...register('cptCode')} placeholder="e.g. 99214" />
              </div>
              <div className="space-y-2">
                <Label>Governing Statute</Label>
                <Input {...register('statute')} placeholder="e.g. No Surprises Act" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Billed Amount ($)</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...register('billedAmount', { valueAsNumber: true })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>FMV Benchmark ($)</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...register('fmvAmount', { valueAsNumber: true })} 
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed">
                <div className="text-xs text-muted-foreground mb-1 uppercase">Computed Variance</div>
                <div className="text-2xl font-bold text-red-600">
                  -${formData.variance?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs font-medium text-red-500">
                  {formData.variancePercent?.toFixed(1) || '0'}% over FMV
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Preview Panel */}
        <div className="flex-1 overflow-y-auto p-12 bg-slate-200 dark:bg-slate-900 flex justify-center">
          <div className="w-full max-w-[850px]">
            <LetterPreview ref={letterRef} data={formData} />
          </div>
        </div>
      </main>
    </div>
  );
}