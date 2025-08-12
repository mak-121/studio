"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Download, Wand2, FileCode, FileJson, Loader2, XCircle, FileText, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generatePdfAction, improveLayoutWithAI } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  html: z.string().min(1, "HTML content is required to generate a PDF."),
  css: z.string().optional(),
});

const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Invoice</title>
</head>
<body>
    <header>
        <h1>Invoice</h1>
    </header>
    <main>
        <p>This is a sample document. Use the AI tool to fix any layout issues!</p>
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Web Development</td>
                    <td>$2,500</td>
                </tr>
                <tr>
                    <td>Design Services</td>
                    <td>$1,200</td>
                </tr>
            </tbody>
        </table>
    </main>
    <footer>
        <p>Thank you for your business!</p>
    </footer>
</body>
</html>`;

const defaultCss = `body {
    font-family: sans-serif;
    line-height: 1.5;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}
header, footer {
    text-align: center;
    padding: 1em 0;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}
th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
th {
    background-color: #f2f2f2;
}`;

type Status = 'idle' | 'generating' | 'improving' | 'success' | 'error';

export function PagePilotClient() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>('idle');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const htmlInputRef = useRef<HTMLInputElement>(null);
  const cssInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      html: defaultHtml,
      css: defaultCss,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'html' | 'css') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        form.setValue(field, content);
        toast({ title: "File loaded", description: `${file.name} has been loaded into the editor.` });
      };
      reader.readAsText(file);
    }
    e.target.value = ''; // Reset file input
  };

  const handleImproveLayout = async () => {
    setStatus('improving');
    const { html, css } = form.getValues();
    const result = await improveLayoutWithAI({ html, css: css || '' });

    if (result.success && result.data) {
      form.setValue('html', result.data.improvedHtml);
      form.setValue('css', result.data.improvedCss || '');
      toast({
        title: "AI Improvement Complete",
        description: "The layout has been updated.",
      });
      setStatus('idle');
    } else {
      toast({
        variant: "destructive",
        title: "AI Improvement Failed",
        description: result.error,
      });
      setStatus('error');
      setErrorMessage(result.error || 'An unknown error occurred.');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setStatus('generating');
    setPdfUrl(null);
    setErrorMessage('');

    const result = await generatePdfAction(values.html, values.css || '');

    if (result.success && result.data) {
      try {
        const byteCharacters = atob(result.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }

        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setStatus('success');
      } catch (e) {
        setStatus('error');
        setErrorMessage('Failed to decode and display the PDF.');
        toast({ variant: "destructive", title: "PDF Display Error", description: 'There was an issue displaying the generated PDF.' });
      }
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'An unknown error occurred during PDF generation.');
      setPdfUrl(null);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const isLoading = status === 'generating' || status === 'improving';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <input type="file" ref={htmlInputRef} onChange={(e) => handleFileChange(e, 'html')} accept=".html,text/html" className="hidden" />
        <input type="file" ref={cssInputRef} onChange={(e) => handleFileChange(e, 'css')} accept=".css,text/css" className="hidden" />
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Code</CardTitle>
            <CardDescription>Input your HTML and CSS here, or upload files.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="html">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
              </TabsList>
              <TabsContent value="html">
                <FormField
                  control={form.control}
                  name="html"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">HTML</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste your HTML here" className="min-h-[400px] font-code text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 mt-2">
                   <Button type="button" variant="outline" size="sm" onClick={() => htmlInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Upload</Button>
                   <Button type="button" variant="ghost" size="sm" onClick={() => form.setValue('html', '')}><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
                </div>
              </TabsContent>
              <TabsContent value="css">
                <FormField
                  control={form.control}
                  name="css"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">CSS</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste your CSS here" className="min-h-[400px] font-code text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 mt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => cssInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Upload</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => form.setValue('css', '')}><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={handleImproveLayout} disabled={isLoading}>
              {status === 'improving' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Improve with AI
            </Button>
            <Button type="submit" disabled={isLoading}>
              {status === 'generating' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCode className="mr-2 h-4 w-4" />}
              Generate PDF
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="font-headline">Preview</CardTitle>
            <CardDescription>A preview of your generated PDF will appear below.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[500px] bg-muted/50 rounded-md border flex items-center justify-center">
            {status === 'generating' && (
              <div className="text-center text-muted-foreground p-8">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="font-headline text-lg font-semibold">Generating PDF...</h3>
                <p>Your document is being prepared.</p>
              </div>
            )}
            {status !== 'generating' && pdfUrl && (
              <embed src={pdfUrl} type="application/pdf" className="w-full h-[600px]" />
            )}
            {status !== 'generating' && !pdfUrl && (
              <div className="text-center text-muted-foreground p-8">
                {status === 'error' ? (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Generation Failed</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <FileText className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="font-headline text-lg font-semibold">PDF Preview Area</h3>
                    <p>Click "Generate PDF" to see your document.</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
          {pdfUrl && status === 'success' && (
            <CardFooter className="justify-end">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardFooter>
          )}
        </Card>
      </form>
    </Form>
  );
}
