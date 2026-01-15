import React, { forwardRef } from 'react';
import { Dispute } from '@shared/types';
import { formatCurrency, formatDate } from '@/lib/formatting';
interface LetterPreviewProps {
  data: Partial<Dispute>;
}
export const LetterPreview = forwardRef<HTMLDivElement, LetterPreviewProps>(({ data }, ref) => {
  const today = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  return (
    <div 
      ref={ref}
      className="bg-white text-slate-900 p-12 md:p-16 shadow-2xl min-h-[1056px] w-full max-w-[816px] mx-auto font-serif leading-relaxed print:shadow-none print:p-0"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-right text-sm italic text-slate-500 print:text-black">
          {today}
        </div>
        {/* Recipient */}
        <div className="space-y-1">
          <div className="font-bold">Billing Department</div>
          <div>{data.providerName || "[Provider Name]"}</div>
          <div>Re: Formal Billing Dispute</div>
          <div>Patient: {data.patientName || "[Patient Name]"}</div>
          <div>Case Ref: {data.patientHash || "[Reference ID]"}</div>
        </div>
        {/* Body */}
        <div className="pt-4">
          <p className="mb-4">To Whom It May Concern,</p>
          <p className="mb-4">
            This letter serves as a formal dispute regarding the invoice received for services rendered 
            on {data.dateOfService ? formatDate(data.dateOfService) : "[Date]"}. 
            Specifically, I am disputing the billed amount for CPT Code: <strong>{data.cptCode || "[CPT]"}</strong>.
          </p>
          <p className="mb-4">
            Under <strong>{data.statute || "applicable federal and state statutes"}</strong>, providers 
            are required to provide billing that is consistent with Fair Market Value (FMV) and reasonable 
            benchmarks. Upon forensic review, the following variance was identified:
          </p>
          {/* Table */}
          <table className="w-full border-collapse border border-slate-300 mb-6">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-left">Description</th>
                <th className="border border-slate-300 p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2">Billed Amount</td>
                <td className="border border-slate-300 p-2 text-right">{formatCurrency(data.billedAmount || 0)}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2">Fair Market Value (FMV) Benchmark</td>
                <td className="border border-slate-300 p-2 text-right">{formatCurrency(data.fmvAmount || 0)}</td>
              </tr>
              <tr className="font-bold text-red-600 print:text-black">
                <td className="border border-slate-300 p-2">Forensic Variance</td>
                <td className="border border-slate-300 p-2 text-right">({formatCurrency(data.variance || 0)})</td>
              </tr>
            </tbody>
          </table>
          <p className="mb-4">
            The billed amount represents a <strong>{data.variancePercent?.toFixed(1) || "0"}%</strong> increase 
            above the standard FMV for this region and service type. This discrepancy exceeds reasonable 
            valuation limits.
          </p>
          <p className="mb-4">
            I request a revised statement reflecting the FMV benchmark within 30 days. Please provide 
            an itemized ledger and verification of the pricing methodology used for this claim.
          </p>
          <p className="pt-8">Sincerely,</p>
          <div className="mt-12 border-t border-slate-400 w-48" />
          <p className="mt-2">{data.patientName || "[Signature Name]"}</p>
        </div>
      </div>
    </div>
  );
});
LetterPreview.displayName = 'LetterPreview';