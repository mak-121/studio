"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Download, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generatePdfAction } from '@/app/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  receipt_no: z.string().min(1, "Receipt number is required."),
  date: z.string().min(1, "Date is required."),
  name: z.string().min(1, "Recipient name is required."),
  plot_type: z.string(),
  plot_number: z.string().min(1, "Number is required."),
  plot: z.string().optional(),
  payment_mode: z.string(),
  other_payment_mode: z.string().optional(),
  bank: z.string().optional(),
  branch: z.string().optional(),
  cheque_no: z.string().optional(),
  sales_amount: z.string().min(1, "Sales amount is required."),
  extra_work: z.string().optional(),
  other_receipts: z.string().optional(),
  amount: z.coerce.number(),
}).refine((data) => {
    if (data.payment_mode !== 'Cash' && !data.cheque_no) {
        return false;
    }
    return true;
}, {
    message: "Cheque / Transaction No is required.",
    path: ["cheque_no"],
});

export function PagePilotClient() {
  const { toast } = useToast();
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      receipt_no: '',
      date: new Date().toISOString().split('T')[0],
      name: '',
      plot_type: 'Flat No.',
      plot_number: '',
      payment_mode: 'Cheque',
      bank: '',
      branch: '',
      cheque_no: '',
      sales_amount: "0",
      extra_work: "0",
      other_receipts: "0",
      amount: 0,
    },
  });

  const { watch, setValue, formState: { isValid } } = form;

  const paymentMode = watch('payment_mode');
  const salesAmount = watch('sales_amount');
  const extraWork = watch('extra_work');
  const otherReceipts = watch('other_receipts');
  const plotType = watch('plot_type');
  const plotNumber = watch('plot_number');

  useEffect(() => {
    const sales = Number(salesAmount) || 0;
    const extra = Number(extraWork) || 0;
    const others = Number(otherReceipts) || 0;
    setValue('amount', sales + extra + others);
  }, [salesAmount, extraWork, otherReceipts, setValue]);

  useEffect(() => {
    setValue('plot', `${plotType} ${plotNumber}`);
  }, [plotType, plotNumber, setValue]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setStatus('generating');
    if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
    }

    const finalValues = { ...values };
    if (values.payment_mode === 'Other') {
        finalValues.payment_mode = values.other_payment_mode || 'Other';
    }

    const result = await generatePdfAction(finalValues);

    if (result.success && result.data) {
        try {
            const byteCharacters = atob(result.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setStatus('success');
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `receipt_${values.receipt_no}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (e) {
            setStatus('error');
            toast({ variant: "destructive", title: "PDF Display Error", description: 'There was an issue displaying the generated PDF.' });
        }
    } else {
        setStatus('error');
        toast({ variant: "destructive", title: "PDF Generation Failed", description: result.error });
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `receipt_${form.getValues('receipt_no')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const isLoading = status === 'generating';

  return (
    <div className="flex justify-center items-start min-h-screen py-10">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl bg-card p-20px 40px 40px 40px rounded-xl shadow-lg border-t-4 border-primary">
        <div className="text-center mb-6">
          <img src="https://placehold.co/180x60.png" alt="KP Enterprise Logo" data-ai-hint="logo company" className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Receipt Data Entry</h2>
        </div>

        <fieldset className="mb-6">
          <legend className="text-lg font-semibold text-primary w-full border-b pb-2 mb-4">Recipient &amp; Property Details</legend>
          <FormField control={form.control} name="receipt_no" render={({ field }) => (
            <FormItem className="mb-4"><FormLabel>Receipt No:</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="date" render={({ field }) => (
            <FormItem className="mb-4"><FormLabel>Date:</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem className="mb-4"><FormLabel>Received From (Name):</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="plot_type" render={({ field }) => (
              <FormItem><FormLabel>Type:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent><SelectItem value="Flat No.">Flat No.</SelectItem><SelectItem value="Plot No.">Plot No.</SelectItem></SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="plot_number" render={({ field }) => (
                <FormItem><FormLabel>Number:</FormLabel><FormControl><Input placeholder="e.g., 303" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="text-lg font-semibold text-primary w-full border-b pb-2 mb-4">Payment Information</legend>
          <FormField control={form.control} name="payment_mode" render={({ field }) => (
            <FormItem className="mb-4"><FormLabel>Payment Mode:</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Cheque">Cheque</SelectItem><SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="NEFT">NEFT</SelectItem><SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Other">Other...</SelectItem>
                </SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
          {paymentMode === 'Other' && (
            <FormField control={form.control} name="other_payment_mode" render={({ field }) => (
              <FormItem className="mb-4"><FormLabel>Custom Payment Mode:</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          )}
          <FormField control={form.control} name="bank" render={({ field }) => (
            <FormItem className="mb-4"><FormLabel>Bank Name:</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="branch" render={({ field }) => (
            <FormItem className="mb-4"><FormLabel>Branch:</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="cheque_no" render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Cheque / Transaction No: {paymentMode === 'Cash' && '(Optional)'}</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </fieldset>

        <fieldset>
          <legend className="text-lg font-semibold text-primary w-full border-b pb-2 mb-4">Amount Breakdown</legend>
          <FormField control={form.control} name="sales_amount" render={({ field }) => (
            <FormItem className="mb-4"><FormLabel>Sales Amount:</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="extra_work" render={({ field }) => (
            <FormItem className="mb-4"><FormLabel>Extra Work:</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="other_receipts" render={({ field }) => (
            <FormItem className="mb-4"><FormLabel>Other Receipts:</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="amount" render={({ field }) => (
            <FormItem><FormLabel>Total Amount (auto-calculated):</FormLabel><FormControl><Input type="number" {...field} readOnly className="bg-muted" /></FormControl><FormMessage /></FormItem>
          )} />
        </fieldset>
        
        <Button type="submit" className="w-full mt-8" disabled={isLoading || !isValid}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate PDF Receipt
        </Button>
        {status === 'success' && pdfUrl && (
             <Button onClick={handleDownload} className="w-full mt-2" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Again
            </Button>
        )}
      </form>
    </Form>
    </div>
  );
}
