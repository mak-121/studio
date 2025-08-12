'use server';

import handlebars from 'handlebars';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { toWords } from 'number-to-words';

const receiptTemplateHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Receipt</title>
    <style>
      @page {
        margin: 30px;
      }
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        color: #000;
        position: relative;
      }
      .receipt-container {
        page-break-inside: avoid;
        page-break-before: auto;
        page-break-after: auto;
      }

      .flex-wrap {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        page-break-inside: avoid;
        white-space: nowrap;
      }

      .summary {
        page-break-inside: avoid;
      }

      .no-break {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        page-break-inside: avoid;
        flex-wrap: nowrap;
      }
      .summary {
        border-collapse: collapse;
      }
      .summary th,
      .summary td {
        border: 1px solid #000;
        padding: 6px;
        text-align: left;
      }
      .signature {
        text-align: center;
        margin-left: 20px;
      }

      .content {
        position: relative;
        z-index: 1;
      }
      .no-break-row {
        page-break-inside: avoid;
        page-break-before: auto;
        page-break-after: auto;
      }
      .summary-table {
        border-collapse: collapse;
        width: auto;
      }
      .summary-table th,
      .summary-table td {
        border: 1px solid #000;
        padding: 6px;
        text-align: left;
      }
      .signature-box {
        text-align: center;
        vertical-align: top;
        padding-left: 20px;
      }
      .signature-frame {
        border: 1px solid black;
        width: 100px;
        height: 50px;
        margin: 10px auto;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 6px;
      }
      header .logo img {
        width: 140px;
      }
      header .right {
        text-align: right;
        font-size: 11px;
      }

      .title {
        text-align: center;
        font-size: 20px;
        font-weight: 700;
        margin-top: 6px;
      }
      .subtitle {
        text-align: center;
        font-size: 14px;
        margin-top: 2px;
      }

      .box {
        border: 1px solid #000;
        padding: 10px;
        margin-top: 10px;
      }

      .desc {
        margin-top: 12px;
        line-height: 1.4;
        text-align: justify;
      }

      .summary {
        width: 60%;
        border-collapse: collapse;
        margin-top: 12px;
      }
      .summary th,
      .summary td {
        border: 1px solid #000;
        padding: 6px;
        text-align: left;
      }
      .summary th {
        background: #f2f2f2;
        font-weight: 700;
      }
      .right-align {
        text-align: right;
      }

      footer {
        margin-top: 20px;
        font-size: 11px;
      }
      .signature {
        float: right;
        text-align: center;
        margin-top: 40px;
      }

      .my-box {
        width: 100px;
        height: 50px;
        background-color: #ffffff;
        border: 2px solid black;
        padding: 10px;
        margin: 20px;
      }

      /* Ensure both receipts fit in one page */
      .receipt {
        page-break-inside: avoid;
        border-bottom: 2px dashed #000;
        margin-bottom: 15px;
        padding-bottom: 15px;
      }

      .form_data {
        word-break: break-word;
    white-space: pre-wrap;
      }

      
    </style>
  </head>
  <body>
    <div class="receipt-container">
      <!-- ORIGINAL -->
      <div class="content receipt">
        <header>
          <div class="right">Original</div>
          <div class="logo">
            <img src="{{ logo_url }}" alt="logo" />
          </div>
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
          <div class="right">Duplicate</div>
          <div class="logo">
            <img src="{{ logo_url }}" alt="logo" />
          </div>
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

handlebars.registerHelper('ne', function (a, b) {
  return a !== b;
});

export async function generatePdfAction(formData: any) {
  let browser;
  try {
    const template = handlebars.compile(receiptTemplateHtml);

    const total = Number(formData.amount) || 0;
    const salesAmount = Number(formData.sales_amount) || 0;
    const extraWork = Number(formData.extra_work) || 0;
    const otherReceipts = Number(formData.other_receipts) || 0;

    const templateData = {
        ...formData,
        amount_formatted: formatNumber(total),
        amount_words: toWords(total).replace(/\b\w/g, (l: string) => l.toUpperCase()),
        sales_amount_formatted: formatNumber(salesAmount),
        extra_work_formatted: extraWork === 0 ? '-' : formatNumber(extraWork),
        other_receipts_formatted: otherReceipts === 0 ? '-' : formatNumber(otherReceipts),
        total_amount_formatted: formatNumber(total),
        logo_url: `https://placehold.co/140x60.png`,
    };

    const html = template(templateData);

    browser = await puppeteer.launch({ 
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });
    
    return { success: true, data: pdfBuffer.toString('base64') };
  } catch (error: any) {
    console.error('PDF generation failed:', error);
    return { success: false, error: `Failed to generate PDF: ${error.message}` };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
