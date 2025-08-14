'use server';

import Handlebars from 'handlebars';
import { toWords } from 'number-to-words';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const receiptTemplateHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Receipt</title>
    <style>
  @page {
    size: A4;
    margin: 20px; /* Reduced page margin */
  }
  body {
    font-family: Arial, sans-serif;
    font-size: 11px; /* Slightly smaller font for better fit */
    color: #000;
  }
  /* --- Layout & Spacing --- */
  .receipt-container {
      page-break-inside: avoid;
  }
  .receipt {
    page-break-inside: avoid;
    padding-bottom: 10px;
  }
  .receipt.original {
    border-bottom: 2px dashed #000;
    margin-bottom: 10px; /* Reduced space between receipts */
  }
  .box {
    border: 1px solid #000;
    padding: 10px;
    margin-top: 8px;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 5px;
  }
  footer {
    margin-top: 15px; /* Reduced footer margin */
    font-size: 9px;
    line-height: 1.4;
  }
  /* --- Typography --- */
  header .right {
    font-weight: bold;
  }
  .title {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    margin-top: 5px;
  }
  .subtitle {
    text-align: center;
    font-size: 13px;
    margin-top: 2px;
  }
  .desc {
    margin-top: 8px;
    line-height: 1.5;
    text-align: left; /* Use left-align to avoid bad spacing */
  }
  /* --- Tables & Signature --- */
  .summary-container {
    width: 100%;
    margin-top: 5px;
  }
  .summary {
    border-collapse: collapse;
  }
  .summary th,
  .summary td {
    border: 1px solid #000;
    padding: 5px; /* Reduced cell padding */
    text-align: left;
  }
  .summary th {
    background: #f2f2f2;
    font-weight: 700;
  }
  .right-align {
    text-align: right;
  }
  .signature-box {
    text-align: center;
    vertical-align: top;
    padding-left: 20px;
  }
  .signature-frame {
    border: 1px solid black;
    width: 120px;
    height: 50px;
    margin: 5px auto;
  }
  .logo img {
    width: 130px;
  }
</style>
  </head>
  <body>
    <div class="receipt-container">
      <!-- ORIGINAL -->
      <div class="content receipt original">
        <header>
          <div class="logo">
            <img src="/logo.png" alt="logo" />
          </div>
          <div class="right">Original</div>
        </header>

        <div class="title">KP ENTERPRISE</div>
        <div class="subtitle">"SANSKRUTI PRIDE"</div>
        <div style="text-align: center; font-size: 10px; margin-top: 4px">
          Sur. No.726, FP-27/1, TP-415, Nr. Raslila Party Plot Kathwada,
          Ahmedabad:382430
        </div>

        <div
          style="
            text-align: center;
            margin-top: 10px;
            font-weight: 700;
            font-size: 16px;
          "
        >
          "RECEIPT"
        </div>

        <div class="box">
          <table style="width: 100%">
            <tr>
              <td style="font-weight: 700">Receipt No.: {{ receipt_no }}</td>
              <td style="text-align: right; font-weight: 700">
                Date: {{ date }}
              </td>
            </tr>
          </table>

          <div class="desc">
            Received with thanks, from <b class="form_data">{{ name }}</b>  ,towards booking of
            <b class="form_data">{{ plot }}</b> of Project - Sanskruti Pride with sums of Rs.
            <b class="form_data">{{ amount_formatted }}</b>/- (In words:<b>Rupees {{ amount_words }} only</b>) by
            <b>{{ payment_mode }}</b> 
            {{#if (ne payment_mode "Cash")}}
            drawn on Bank: <b class="form_data">{{ bank }}</b> Branch:
            <b class="form_data">{{ branch }}</b> through <b>{{ payment_mode }}</b> No.
            <b>{{ cheque_no }}.</b>
              {{else}}
              .
            {{/if}}
          </div>
          <br />
          <div>Summary to Amount received as above towards</div>

          <table style="width: 100%">
            <tr class="no-break-row">
              <!-- Table with amounts -->
              <td>
                <table class="summary">
                  <tr>
                    <th>Particulars</th>
                    <th>Amount Rs.</th>
                  </tr>
                  <tr>
                    <td>Sales Consideration</td>
                    <td class="right-align">{{ sales_amount_formatted }}</td>
                  </tr>
                  <tr>
                    <td>Extra Work</td>
                    <td class="right-align">{{ extra_work_formatted }}</td>
                  </tr>
                  <tr>
                    <td>Other Receipts</td>
                    <td class="right-align">{{ other_receipts_formatted }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 700">Total Amount</td>
                    <td style="font-weight: 700" class="right-align">
                      {{ total_amount_formatted }}
                    </td>
                  </tr>
                </table>
              </td>
              <td class="signature-box">
                For, KP ENTERPRISE
                <div class="signature-frame"></div>
                Authorized Signatory / Partner
              </td>
            </tr>
          </table>
          <br>
          <b><u>Amount in Words: Rupees {{ amount_words }} only</u></b>

          <div style="clear: both"></div>
        </div>

        <footer>
          <div>
            1) Subject to realisation of Cheque / NEFT / RTGS / Online payments
          </div>
          <div>2) Subject to Ahmedabad Jurisdiction</div>
          <div>GST Reg. No.: 24AEKFS0517C1ZG</div>
          <div>
            RERA Reg.No.: PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/MAA09123/011021
          </div>
        </footer>
      </div>

      <!-- DUPLICATE -->
      <div class="content receipt">
        <header>
          <div class="logo">
            <img src="/logo.png" alt="logo" />
          </div>
          <div class="right">Duplicate</div>
        </header>

        <div class="title">KP ENTERPRISE</div>
        <div class="subtitle">"SANSKRUTI PRIDE"</div>
        <div style="text-align: center; font-size: 10px; margin-top: 4px">
          Sur. No.726, FP-27/1, TP-415, Nr. Raslila Party Plot Kathwada,
          Ahmedabad:382430
        </div>

        <div
          style="
            text-align: center;
            margin-top: 10px;
            font-weight: 700;
            font-size: 16px;
          "
        >
          "RECEIPT"
        </div>

        <div class="box">
          <table style="width: 100%">
            <tr>
              <td style="font-weight: 700">Receipt No.: {{ receipt_no }}</td>
              <td style="text-align: right; font-weight: 700">
                Date: {{ date }}
              </td>
            </tr>
          </table>

          <div class="desc">
           Received with thanks, from <b class="form_data">{{ name }}</b>  ,towards booking of
            <b class="form_data">{{ plot }}</b> of Project - Sanskruti Pride with sums of Rs.
            <b class="form_data">{{ amount_formatted }}</b>/- (In words: <b>Rupees {{ amount_words }} only</b>) by
            <b>{{ payment_mode }}</b> 
            {{#if (ne payment_mode "Cash")}}
            drawn on Bank: <b class="form_data">{{ bank }}</b> Branch:
            <b class="form_data">{{ branch }}</b> through <b>{{ payment_mode }}</b> No.
            <b>{{ cheque_no }}.</b>
              {{else}}
              .
            {{/if}}
          </div>
          <br />
          <div>Summary to Amount received as above towards</div>

          <table style="width: 100%">
            <tr class="no-break-row">
              <!-- Table with amounts -->
              <td>
                <table class="summary">
                  <tr>
                    <th>Particulars</th>
                    <th>Amount Rs.</th>
                  </tr>
                  <tr>
                    <td>Sales Consideration</td>
                    <td class="right-align">{{ sales_amount_formatted }}</td>
                  </tr>
                  <tr>
                    <td>Extra Work</td>
                    <td class="right-align">{{ extra_work_formatted }}</td>
                  </tr>
                  <tr>
                    <td>Other Receipts</td>
                    <td class="right-align">{{ other_receipts_formatted }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 700">Total Amount</td>
                    <td style="font-weight: 700" class="right-align">
                      {{ total_amount_formatted }}
                    </td>
                  </tr>
                </table>
              </td>
              <td class="signature-box">
                For, KP ENTERPRISE
                <div class="signature-frame"></div>
                Authorized Signatory / Partner
              </td>
            </tr>
          </table>
          <br>
          <b>Amount in Words: Rupees {{ amount_words }} only</b>

          <div style="clear: both"></div>
        </div>

        <footer>
          <div>
            1) Subject to realisation of Cheque / NEFT / RTGS / Online payments
          </div>
          <div>2) Subject to Ahmedabad Jurisdiction</div>
          <div>GST Reg. No.: 24AEKFS0517C1ZG</div>
          <div>
            RERA Reg.No.: PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/MAA09123/011021
          </div>
        </footer>
      </div>
    </div>
  </body>
</html>
`;

const formatNumber = (num: number) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);

const formatDate = (dateString: string) => {
    try {
        const [year, month, day] = dateString.split('-');
        if (!year || !month || !day) return dateString; // Return original if format is unexpected
        return `${day}-${month}-${year.slice(-2)}`;
    } catch (e) {
        return dateString; // Return original on error
    }
};

Handlebars.registerHelper('ne', function (a, b) {
  return a !== b;
});

export async function generatePdfAction(formData: any) {
  try {
    const template = Handlebars.compile(receiptTemplateHtml);

    const total = Number(formData.amount) || 0;
    const salesAmount = Number(formData.sales_amount) || 0;
    const extraWork = Number(formData.extra_work) || 0;
    const otherReceipts = Number(formData.other_receipts) || 0;

    const templateData = {
        ...formData,
        date: formatDate(formData.date),
        amount_formatted: formatNumber(total),
        amount_words: toWords(total).replace(/\b\w/g, (l: string) => l.toUpperCase()),
        sales_amount_formatted: formatNumber(salesAmount),
        extra_work_formatted: extraWork === 0 ? '-' : formatNumber(extraWork),
        other_receipts_formatted: otherReceipts === 0 ? '-' : formatNumber(otherReceipts),
        total_amount_formatted: formatNumber(total),
    };

    const html = template(templateData);
    
    return { success: true, data: html };
  } catch (error: any) {
    console.error('HTML generation failed:', error);
    return { success: false, error: `Failed to generate HTML: ${error.message}` };
  }
}

const CSV_FILE_PATH = path.join(os.tmpdir(), 'receipt_log.csv');
const CSV_HEADERS = [
    'receipt_no', 'date', 'name', 'plot',
    'payment_mode', 'bank', 'branch', 'cheque_no',
    'sales_amount', 'extra_work', 'other_receipts', 'amount'
];

function sanitizeCsvValue(value: any): string {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export async function recordToCsvAction(formData: any) {
  try {
    const csvRow = CSV_HEADERS.map(header => sanitizeCsvValue(formData[header])).join(',');

    try {
      // Check if file exists, if not, create it with a header
      await fs.access(CSV_FILE_PATH);
    } catch {
      const headerRow = CSV_HEADERS.join(',');
      await fs.writeFile(CSV_FILE_PATH, headerRow + '\n', 'utf-8');
    }

    // Append new row
    await fs.appendFile(CSV_FILE_PATH, csvRow + '\n', 'utf-8');
    
    return { success: true };
  } catch (error: any) {
    console.error('CSV writing failed:', error);
    return { success: false, error: `Failed to write to CSV: ${error.message}` };
  }
}


export async function downloadCsvAction() {
    try {
        await fs.access(CSV_FILE_PATH);
        const fileContent = await fs.readFile(CSV_FILE_PATH, 'utf-8');
        return { success: true, data: fileContent };
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return { success: false, error: "Log file does not exist yet. Please generate a receipt first." };
        }
        console.error('CSV reading failed:', error);
        return { success: false, error: `Failed to read CSV file: ${error.message}` };
    }
}
