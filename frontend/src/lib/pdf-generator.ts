export interface AppointmentSlipDetails {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  doctor_name: string;
  doctor_specialty?: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  consultation_fee?: number | string;
  status?: string;
  notes?: string;
}

export function downloadAppointmentPDF(slip: AppointmentSlipDetails) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download your PDF appointment slip.");
    return;
  }

  const formattedDate = new Date(slip.appointment_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Slip - ${slip.id.slice(0, 8).toUpperCase()}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 12mm;
        }
        body {
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 24px;
          background: #ffffff;
        }
        .slip-card {
          border: 2px solid #0284c7;
          border-radius: 20px;
          padding: 36px;
          max-width: 720px;
          margin: 0 auto;
          box-shadow: 0 8px 24px rgba(2, 132, 199, 0.08);
          background: #ffffff;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px dashed #cbd5e1;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }
        .clinic-brand h1 {
          margin: 0;
          font-size: 24px;
          color: #0284c7;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .clinic-brand p {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }
        .slip-badge {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          color: #0369a1;
          padding: 10px 18px;
          border-radius: 14px;
          text-align: right;
        }
        .slip-badge .title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 800;
        }
        .slip-badge .id {
          font-size: 15px;
          font-weight: 900;
          font-family: monospace;
          margin-top: 2px;
        }
        .section-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 800;
          color: #0369a1;
          background: #f8fafc;
          padding: 6px 12px;
          border-radius: 6px;
          margin-bottom: 12px;
          border-left: 4px solid #0284c7;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 24px;
        }
        .info-item {
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .info-label {
          font-size: 10px;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .info-value {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }
        .highlight-box {
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
          border: 1.5px solid #a7f3d0;
          padding: 18px 24px;
          border-radius: 16px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .highlight-date {
          font-size: 16px;
          font-weight: 800;
          color: #065f46;
        }
        .highlight-time {
          font-size: 15px;
          font-weight: 800;
          color: #047857;
          background: #ffffff;
          padding: 6px 16px;
          border-radius: 10px;
          border: 1px solid #6ee7b7;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        .instructions {
          background: #fffbeb;
          border: 1px solid #fde68a;
          padding: 16px;
          border-radius: 14px;
          font-size: 12px;
          color: #78350f;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .instructions ul {
          margin: 6px 0 0 0;
          padding-left: 20px;
        }
        .footer-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px dashed #cbd5e1;
          padding-top: 16px;
          font-size: 11px;
          color: #94a3b8;
        }
        .status-stamp {
          border: 2px dashed #10b981;
          color: #059669;
          font-weight: 900;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 8px;
          letter-spacing: 1px;
        }
        .print-btn-bar {
          text-align: center;
          margin-bottom: 20px;
        }
        .print-btn {
          background: #0284c7;
          color: white;
          border: none;
          padding: 12px 28px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
          transition: all 0.2s ease;
        }
        .print-btn:hover {
          background: #0369a1;
        }
        @media print {
          body { padding: 0; background: none; }
          .no-print { display: none !important; }
          .slip-card { border: 1.5px solid #000; box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print print-btn-bar">
        <button class="print-btn" onclick="window.print()">
          🖨️ Click to Print / Save as PDF
        </button>
      </div>

      <div class="slip-card">
        <div class="header-row">
          <div class="clinic-brand">
            <h1>🏥 Lumina Health Clinic</h1>
            <p>123 Medical Boulevard, Suite 400 • Phone: +92 300 1234567</p>
          </div>
          <div class="slip-badge">
            <div class="title">Official Appointment Slip</div>
            <div class="id">#${slip.id.slice(0, 8).toUpperCase()}</div>
          </div>
        </div>

        <div class="highlight-box">
          <div>
            <div style="font-size: 10px; text-transform: uppercase; color: #047857; font-weight: 800; margin-bottom: 2px;">Scheduled Date</div>
            <div class="highlight-date">${formattedDate}</div>
          </div>
          <div>
            <div style="font-size: 10px; text-transform: uppercase; color: #047857; font-weight: 800; margin-bottom: 2px; text-align: right;">Time Slot</div>
            <div class="highlight-time">${slip.appointment_time}</div>
          </div>
        </div>

        <div class="section-title">Patient Profile Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Patient Name</div>
            <div class="info-value">${slip.patient_name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Contact Phone</div>
            <div class="info-value">${slip.patient_phone}</div>
          </div>
          ${slip.patient_email ? `
          <div class="info-item" style="grid-column: span 2;">
            <div class="info-label">Email Address</div>
            <div class="info-value">${slip.patient_email}</div>
          </div>
          ` : ""}
        </div>

        <div class="section-title">Medical Consultation Details</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Requested Service</div>
            <div class="info-value">${slip.service_name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Assigned Specialist</div>
            <div class="info-value">${slip.doctor_name} ${slip.doctor_specialty ? `(${slip.doctor_specialty})` : ""}</div>
          </div>
          ${slip.consultation_fee ? `
          <div class="info-item">
            <div class="info-label">Consultation Fee</div>
            <div class="info-value">$${slip.consultation_fee} USD</div>
          </div>
          ` : ""}
          <div class="info-item">
            <div class="info-label">Booking Status</div>
            <div class="info-value" style="color: #059669; text-transform: uppercase;">${slip.status || "CONFIRMED"}</div>
          </div>
        </div>

        <div class="instructions">
          <strong>📌 Important Patient Instructions:</strong>
          <ul>
            <li>Please arrive 15 minutes prior to your scheduled time slot for initial registration and check-in.</li>
            <li>Bring a valid photo ID along with any relevant medical records or lab test reports.</li>
            <li>To cancel or reschedule, please use your online dashboard at least 2 hours before the scheduled time.</li>
          </ul>
        </div>

        <div class="footer-row">
          <div>
            <p style="margin: 0; font-weight: 700; color: #64748b;">Lumina Health System • Authorized Confirmation Document</p>
            <p style="margin: 2px 0 0 0;">Generated on ${new Date().toLocaleDateString("en-US")} at ${new Date().toLocaleTimeString("en-US")}</p>
          </div>
          <div class="status-stamp">VERIFIED SLIP</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
