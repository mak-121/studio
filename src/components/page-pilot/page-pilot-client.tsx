
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Printer, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generatePdfAction, recordToCsvAction } from '@/app/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

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
  const [status, setStatus] = useState<'idle' | 'generating' | 'error'>('idle');

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

    const finalValues = { ...values };
    if (values.payment_mode === 'Other') {
        finalValues.payment_mode = values.other_payment_mode || 'Other';
    }

    const result = await generatePdfAction(finalValues);
    
    if (result.success && result.data) {
        // Also record to CSV
        const csvResult = await recordToCsvAction(finalValues);
        if (!csvResult.success) {
            console.error("Failed to record to CSV:", csvResult.error);
            // Optionally notify user of CSV write failure
            toast({ variant: "destructive", title: "CSV Write Error", description: "Could not save the record to the log file." });
        }

        try {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(result.data);
                printWindow.document.close();
                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();
                };
                 setStatus('idle');
            } else {
                setStatus('error');
                toast({ variant: "destructive", title: "Print Error", description: "Could not open print window. Please disable your pop-up blocker." });
            }
        } catch (e: any) {
            setStatus('error');
            toast({ variant: "destructive", title: "Print Error", description: `There was an issue preparing the document for printing: ${e.message}` });
        }
    } else {
        setStatus('error');
        toast({ variant: "destructive", title: "HTML Generation Failed", description: result.error });
    }
  };
  
  const isLoading = status === 'generating';

  return (
    <div className="flex justify-center items-start min-h-screen py-10">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl bg-card p-10 rounded-xl shadow-lg border border-border/50 border-t-4 border-primary">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">KP ENTERPRISE</h1>
          <p className="text-muted-foreground">Receipt Data Entry</p>
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
          <span className="relative z-10 flex items-center justify-center gap-2 transition-transform duration-100 ease-in-out active:translate-y-px">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
              Generate & Print Receipt
          </span>
        </Button>
      </form>
    </Form>
    </div>
  );
}
