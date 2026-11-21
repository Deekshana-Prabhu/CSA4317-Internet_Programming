<?xml version="1.0" encoding="UTF-8"?>
<!--
  XML-Based Hospital Patient Information and Medical Report Management System
  File: patients.xsl
  Description: XSLT Stylesheet transforming patients.xml into an official, print-ready HTML Medical Diagnostic Report
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-public="about:legacy-compat"/>

    <xsl:template match="/">
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Hospital Clinical Diagnostic &amp; Medical Report</title>
            <style>
                :root {
                    --primary: #0284c7;
                    --primary-dark: #0369a1;
                    --teal: #0d9488;
                    --teal-light: #f0fdfa;
                    --bg-slate: #f8fafc;
                    --text-main: #0f172a;
                    --text-muted: #64748b;
                    --border: #e2e8f0;
                }
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    background-color: var(--bg-slate);
                    color: var(--text-main);
                    line-height: 1.5;
                    padding: 24px;
                }
                .report-wrapper {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                /* Hospital Letterhead Header */
                .hospital-header {
                    background: #ffffff;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 24px 32px;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .brand-group {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .hospital-logo {
                    width: 52px;
                    height: 52px;
                    background: linear-gradient(135deg, #0284c7, #0d9488);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffffff;
                    font-size: 26px;
                    font-weight: 700;
                    box-shadow: 0 4px 8px rgba(2, 132, 199, 0.3);
                }
                .hospital-title h1 {
                    font-size: 22px;
                    font-weight: 700;
                    color: #0369a1;
                    letter-spacing: -0.02em;
                }
                .hospital-title p {
                    font-size: 13px;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                .report-meta {
                    text-align: right;
                    font-size: 13px;
                }
                .report-badge {
                    display: inline-block;
                    background: var(--teal-light);
                    color: var(--teal);
                    border: 1px solid #99f6e4;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 12px;
                    margin-bottom: 4px;
                }
                .summary-bar {
                    background: #e0f2fe;
                    border: 1px solid #bae6fd;
                    color: #0369a1;
                    padding: 12px 20px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 600;
                }

                /* Patient Medical Report Card */
                .patient-report-card {
                    background: #ffffff;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    margin-bottom: 28px;
                    overflow: hidden;
                    box-shadow: 0 4px 14px -2px rgba(15, 23, 42, 0.05);
                    page-break-inside: avoid;
                }
                .patient-card-header {
                    background: linear-gradient(to right, #f8fafc, #f1f5f9);
                    border-bottom: 1px solid var(--border);
                    padding: 16px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .patient-id-tag {
                    font-family: monospace;
                    background: #0284c7;
                    color: #ffffff;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 700;
                }
                .patient-card-body {
                    padding: 24px;
                }

                /* Tables Styling */
                .section-heading {
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #0369a1;
                    font-weight: 700;
                    margin: 16px 0 8px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .section-heading:first-child {
                    margin-top: 0;
                }
                .report-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                    font-size: 13.5px;
                }
                .report-table th {
                    background-color: #f1f5f9;
                    color: #334155;
                    font-weight: 600;
                    text-align: left;
                    padding: 10px 14px;
                    border: 1px solid var(--border);
                }
                .report-table td {
                    padding: 10px 14px;
                    border: 1px solid var(--border);
                    color: #1e293b;
                }
                .report-table tbody tr:nth-child(even) {
                    background-color: #f8fafc;
                }
                .report-table tbody tr:hover {
                    background-color: #f0f9ff;
                }

                /* Status Badges */
                .status-badge {
                    display: inline-block;
                    padding: 3px 9px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    text-align: center;
                }
                .status-normal {
                    background-color: #dcfce7;
                    color: #166534;
                    border: 1px solid #bbf7d0;
                }
                .status-high, .status-critical, .status-elevated {
                    background-color: #fee2e2;
                    color: #991b1b;
                    border: 1px solid #fecaca;
                }
                .status-low {
                    background-color: #e0f2fe;
                    color: #075985;
                    border: 1px solid #bae6fd;
                }

                /* Clinical Sign-off Footer */
                .report-footer-seal {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px dashed var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    font-size: 12px;
                    color: var(--text-muted);
                }
                .signature-line {
                    border-top: 1px solid #94a3b8;
                    width: 200px;
                    text-align: center;
                    padding-top: 4px;
                    font-weight: 600;
                    color: #334155;
                }

                /* Print-Friendly Media Query */
                @media print {
                    body {
                        background: #ffffff;
                        padding: 0;
                    }
                    .report-wrapper {
                        max-width: 100%;
                    }
                    .hospital-header, .patient-report-card {
                        box-shadow: none;
                        border: 1px solid #cbd5e1;
                    }
                    .patient-report-card {
                        page-break-after: always;
                    }
                }
            </style>
        </head>
        <body>
            <div class="report-wrapper">
                <!-- Header -->
                <header class="hospital-header">
                    <div class="brand-group">
                        <div class="hospital-logo">&#10010;</div>
                        <div class="hospital-title">
                            <h1>AURA METROPOLITAN HOSPITAL</h1>
                            <p>Clinical Diagnostic &amp; Medical Informatics Directorate</p>
                        </div>
                    </div>
                    <div class="report-meta">
                        <div class="report-badge">XSLT Transformed Report</div>
                        <div>Official Clinical Documentation</div>
                        <div style="color:#64748b; font-size:12px;">Standard: ISO 9001:2015 Accredited</div>
                    </div>
                </header>

                <!-- Summary Bar -->
                <div class="summary-bar">
                    <span>Clinical Registry Status: <strong>Active Records</strong></span>
                    <span>Total Patients Transformed: <strong><xsl:value-of select="count(//patient)"/></strong></span>
                    <span>Total Diagnostic Tests Documented: <strong><xsl:value-of select="count(//test)"/></strong></span>
                </div>

                <!-- Iterate Each Patient -->
                <xsl:for-each select="hospital/patient">
                    <article class="patient-report-card">
                        <div class="patient-card-header">
                            <div>
                                <span class="patient-id-tag"><xsl:value-of select="@id"/></span>
                                <strong style="font-size: 16px; margin-left: 10px; color: #0f172a;">
                                    <xsl:value-of select="name"/>
                                </strong>
                            </div>
                            <div style="font-size: 13px; color: #475569;">
                                Department: <strong style="color: #0284c7;"><xsl:value-of select="department"/></strong>
                            </div>
                        </div>

                        <div class="patient-card-body">
                            <!-- 1. Patient Details Table -->
                            <h3 class="section-heading">&#128100; Patient Details Table</h3>
                            <table class="report-table">
                                <thead>
                                    <tr>
                                        <th>Patient ID</th>
                                        <th>Patient Name</th>
                                        <th>Age</th>
                                        <th>Gender</th>
                                        <th>Blood Group</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong><xsl:value-of select="@id"/></strong></td>
                                        <td><xsl:value-of select="name"/></td>
                                        <td><xsl:value-of select="age"/> Years</td>
                                        <td><xsl:value-of select="gender"/></td>
                                        <td><strong style="color:#0284c7;"><xsl:value-of select="bloodGroup"/></strong></td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- 2. Doctor Details Table -->
                            <h3 class="section-heading">&#9877; Doctor Details Table</h3>
                            <table class="report-table">
                                <thead>
                                    <tr>
                                        <th>Attending Physician</th>
                                        <th>Assigned Department</th>
                                        <th>Clinical Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong><xsl:value-of select="doctor"/></strong></td>
                                        <td><xsl:value-of select="department"/></td>
                                        <td>Consultant In-Charge (Assigned)</td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- 3. Medical Information Table -->
                            <h3 class="section-heading">&#128399; Medical Information &amp; Diagnostic Tests</h3>
                            <table class="report-table">
                                <thead>
                                    <tr>
                                        <th style="width: 28%;">Primary Diagnosis</th>
                                        <th style="width: 32%;">Medical Test Name</th>
                                        <th style="width: 25%;">Test Result Reading</th>
                                        <th style="width: 15%;">Test Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <xsl:for-each select="medicalTests/test">
                                        <tr>
                                            <xsl:if test="position() = 1">
                                                <td rowspan="{count(../test)}" style="vertical-align: top; background: #fafafa; font-weight: 500;">
                                                    <xsl:value-of select="../../diagnosis"/>
                                                </td>
                                            </xsl:if>
                                            <td><strong><xsl:value-of select="@name"/></strong></td>
                                            <td><xsl:value-of select="result"/></td>
                                            <td>
                                                <xsl:choose>
                                                    <xsl:when test="status = 'Normal'">
                                                        <span class="status-badge status-normal">&#10003; Normal</span>
                                                    </xsl:when>
                                                    <xsl:when test="status = 'High' or status = 'Elevated' or status = 'Critical' or status = 'Positive' or status = 'Abnormal'">
                                                        <span class="status-badge status-high">&#9650; <xsl:value-of select="status"/></span>
                                                    </xsl:when>
                                                    <xsl:when test="status = 'Low'">
                                                        <span class="status-badge status-low">&#9660; Low</span>
                                                    </xsl:when>
                                                    <xsl:otherwise>
                                                        <span class="status-badge status-low"><xsl:value-of select="status"/></span>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                            </td>
                                        </tr>
                                    </xsl:for-each>
                                </tbody>
                            </table>

                            <!-- Sign-off -->
                            <div class="report-footer-seal">
                                <div>
                                    <p>Electronic Health Record Verification: <strong>VALIDATED</strong></p>
                                    <p>Document Generated via XML/XSLT Engine</p>
                                </div>
                                <div class="signature-line">
                                    <xsl:value-of select="doctor"/><br/>
                                    <span style="font-size: 11px; font-weight: normal; color: #64748b;">Attending Medical Officer</span>
                                </div>
                            </div>
                        </div>
                    </article>
                </xsl:for-each>
            </div>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>