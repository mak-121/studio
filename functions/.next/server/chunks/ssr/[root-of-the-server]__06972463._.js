module.exports = {

"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/fs/promises [external] (fs/promises, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[project]/src/app/actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00e55241735668b433fb9055cae0e5fbfa6743fcb9":"downloadCsvAction","406753aaf352d89e4c49db0a886f83710e18cf1f56":"recordToCsvAction","40ca25b98a92d40a06b1085750e55b9423c7365d56":"generatePdfAction"},"",""] */ __turbopack_context__.s({
    "downloadCsvAction": (()=>downloadCsvAction),
    "generatePdfAction": (()=>generatePdfAction),
    "recordToCsvAction": (()=>recordToCsvAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$handlebars$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/handlebars/lib/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/os [external] (os, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
// Custom function to convert number to words in Indian format
const amountToWords = (amount)=>{
    const ones = [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine'
    ];
    const teens = [
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen'
    ];
    const tens = [
        '',
        '',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety'
    ];
    const convertLessThanThousand = (num)=>{
        if (num === 0) return '';
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
        return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' ' + convertLessThanThousand(num % 100) : '');
    };
    if (amount === 0) return 'Zero';
    const crores = Math.floor(amount / 10000000);
    const lakhs = Math.floor(amount % 10000000 / 100000);
    const thousands = Math.floor(amount % 100000 / 1000);
    const hundreds = Math.floor(amount % 1000);
    let words = '';
    if (crores > 0) words += convertLessThanThousand(crores) + ' crore ';
    if (lakhs > 0) words += convertLessThanThousand(lakhs) + ' lakh ';
    if (thousands > 0) words += convertLessThanThousand(thousands) + ' thousand ';
    if (hundreds > 0) words += convertLessThanThousand(hundreds);
    return words.trim().replace(/\s+/g, ' ');
};
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
          <div>GST Reg. No.: 24AAYFK8118R1ZA</div>
          <div>
            RERA Reg.No.: PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/MAA12405/101023
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
          <div>GST Reg. No.: 24AAYFK8118R1ZA</div>
          <div>
            RERA Reg.No.: PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/MAA12405/101023
          </div>
        </footer>
      </div>
    </div>
  </body>
</html>
`;
const formatNumber = (num)=>new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
const formatDate = (dateString)=>{
    try {
        const [year, month, day] = dateString.split('-');
        if (!year || !month || !day) return dateString;
        return `${day}-${month}-${year}`;
    } catch (e) {
        return dateString;
    }
};
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$handlebars$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].registerHelper('ne', function(a, b) {
    return a !== b;
});
async function generatePdfAction(formData) {
    try {
        const template = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$handlebars$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].compile(receiptTemplateHtml);
        const total = Number(formData.amount) || 0;
        const salesAmount = Number(formData.sales_amount) || 0;
        const extraWork = Number(formData.extra_work) || 0;
        const otherReceipts = Number(formData.other_receipts) || 0;
        const integerPart = Math.floor(total);
        const decimalPart = Math.round((total - integerPart) * 100);
        let finalWords = amountToWords(integerPart);
        if (decimalPart > 0) {
            finalWords += ' and ' + amountToWords(decimalPart) + ' paise';
        }
        const templateData = {
            ...formData,
            date: formatDate(formData.date),
            amount_formatted: formatNumber(total),
            amount_words: finalWords.replace(/\b\w/g, (l)=>l.toUpperCase()),
            sales_amount_formatted: formatNumber(salesAmount),
            extra_work_formatted: extraWork === 0 ? '-' : formatNumber(extraWork),
            other_receipts_formatted: otherReceipts === 0 ? '-' : formatNumber(otherReceipts),
            total_amount_formatted: formatNumber(total)
        };
        const html = template(templateData);
        return {
            success: true,
            data: html
        };
    } catch (error) {
        console.error('HTML generation failed:', error);
        return {
            success: false,
            error: `Failed to generate HTML: ${error.message}`
        };
    }
}
const CSV_FILE_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__["default"].tmpdir(), 'receipt_log.csv');
const CSV_HEADERS = [
    'receipt_no',
    'date',
    'name',
    'plot',
    'payment_mode',
    'bank',
    'branch',
    'cheque_no',
    'sales_amount',
    'extra_work',
    'other_receipts',
    'amount'
];
function sanitizeCsvValue(value) {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}
async function recordToCsvAction(formData) {
    try {
        const csvRow = CSV_HEADERS.map((header)=>sanitizeCsvValue(formData[header])).join(',');
        try {
            // Check if file exists, if not, create it with a header
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].access(CSV_FILE_PATH);
        } catch  {
            const headerRow = CSV_HEADERS.join(',');
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(CSV_FILE_PATH, headerRow + '\n', 'utf-8');
        }
        // Append new row
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].appendFile(CSV_FILE_PATH, csvRow + '\n', 'utf-8');
        return {
            success: true
        };
    } catch (error) {
        console.error('CSV writing failed:', error);
        return {
            success: false,
            error: `Failed to write to CSV: ${error.message}`
        };
    }
}
async function downloadCsvAction() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].access(CSV_FILE_PATH);
        const fileContent = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].readFile(CSV_FILE_PATH, 'utf-8');
        return {
            success: true,
            data: fileContent
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return {
                success: false,
                error: "Log file does not exist yet. Please generate a receipt first."
            };
        }
        console.error('CSV reading failed:', error);
        return {
            success: false,
            error: `Failed to read CSV file: ${error.message}`
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    generatePdfAction,
    recordToCsvAction,
    downloadCsvAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(generatePdfAction, "40ca25b98a92d40a06b1085750e55b9423c7365d56", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordToCsvAction, "406753aaf352d89e4c49db0a886f83710e18cf1f56", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(downloadCsvAction, "00e55241735668b433fb9055cae0e5fbfa6743fcb9", null);
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions.ts [app-rsc] (ecmascript)");
;
;
;
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00e55241735668b433fb9055cae0e5fbfa6743fcb9": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["downloadCsvAction"]),
    "406753aaf352d89e4c49db0a886f83710e18cf1f56": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordToCsvAction"]),
    "40ca25b98a92d40a06b1085750e55b9423c7365d56": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generatePdfAction"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00e55241735668b433fb9055cae0e5fbfa6743fcb9": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00e55241735668b433fb9055cae0e5fbfa6743fcb9"]),
    "406753aaf352d89e4c49db0a886f83710e18cf1f56": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["406753aaf352d89e4c49db0a886f83710e18cf1f56"]),
    "40ca25b98a92d40a06b1085750e55b9423c7365d56": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40ca25b98a92d40a06b1085750e55b9423c7365d56"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/page.tsx", "default");
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__06972463._.js.map