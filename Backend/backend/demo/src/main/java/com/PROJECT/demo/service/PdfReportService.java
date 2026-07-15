package com.PROJECT.demo.service;

import com.PROJECT.demo.entity.ScreeningLog;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfReportService {

    public byte[] generatePatientReport(String patientId, String patientName, List<ScreeningLog> history) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);

        document.open();

        // 1. Setup Document Fonts
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.DARK_GRAY);
        Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.GRAY);
        Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.WHITE);
        Font tableBodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        // 2. Add Title Headers
        Paragraph title = new Paragraph("ElderShield CDSS - Clinical Analytics Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(10);
        document.add(title);

        Paragraph metadata = new Paragraph("Patient ID: " + patientId + " | Name: " + patientName, subTitleFont);
        metadata.setAlignment(Element.ALIGN_CENTER);
        metadata.setSpacingAfter(25);
        document.add(metadata);

        // 3. Setup Data Table Columns
        PdfPTable table = new PdfPTable(5); // 5 columns
        table.setWidthPercentage(100);
        table.setWidths(new float[]{3f, 2f, 2f, 2f, 3f});

        // 4. Create Header Cells
        String[] headers = {"Timestamp", "Blood Sugar", "SpO2 %", "HRV ms", "Inference Result"};
        for (String headerText : headers) {
            PdfPCell headerCell = new PdfPCell(new Phrase(headerText, tableHeaderFont));
            headerCell.setBackgroundColor(new Color(37, 99, 235)); // Modern Blue Accent
            headerCell.setPadding(8);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(headerCell);
        }

        // 5. Populate Telemetry Database Rows
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        for (ScreeningLog log : history) {
            table.addCell(new PdfPCell(new Phrase(log.getTimestamp().format(formatter), tableBodyFont)));
            table.addCell(new PdfPCell(new Phrase(log.getBloodSugar() + " mg/dL", tableBodyFont)));
            table.addCell(new PdfPCell(new Phrase(log.getSpo2() + "%", tableBodyFont)));
            table.addCell(new PdfPCell(new Phrase(log.getHrv() + " ms", tableBodyFont)));

            // Label Formatting based on Predicted Machine Learning Class
            String classification = "Class 0: Normal";
            if (log.getPredictedClass() == 2) classification = "Class 2: High Fall Risk Level";
            else if (log.getPredictedClass() == 1) classification = "Class 1: Medium Fall Risk Level";

            table.addCell(new PdfPCell(new Phrase(classification, tableBodyFont)));
        }

        document.add(table);
        document.close();

        return out.toByteArray();
    }
}