import type { GeneratedTest } from "@/types";

// -- DOCX generation --

export async function generateDocx(test: GeneratedTest): Promise<Buffer> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    HeadingLevel,
    PageBreak,
  } = await import("docx");

  type HLevel = (typeof HeadingLevel)[keyof typeof HeadingLevel];
  const children: InstanceType<typeof Paragraph>[] = [];

  const heading = (text: string, level: HLevel) =>
    new Paragraph({ text, heading: level, spacing: { before: 400, after: 160 } });

  const body = (text: string, opts?: { bold?: boolean; italic?: boolean; indent?: number }) =>
    new Paragraph({
      children: [
        new TextRun({
          text,
          bold: opts?.bold,
          italics: opts?.italic,
          size: 22,
        }),
      ],
      indent: opts?.indent ? { left: opts.indent } : undefined,
      spacing: { after: 80 },
    });

  const blank = () =>
    new Paragraph({ children: [new TextRun({ text: "" })], spacing: { after: 160 } });

  // Title + date
  children.push(
    new Paragraph({
      children: [new TextRun({ text: test.title, bold: true, size: 36 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated: ${new Date(test.generatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
          color: "888888",
          size: 18,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // Student info line
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Name: ", bold: true, size: 20 }),
        new TextRun({ text: "_".repeat(40) + "   ", size: 20 }),
        new TextRun({ text: "Date: ", bold: true, size: 20 }),
        new TextRun({ text: "_".repeat(20), size: 20 }),
      ],
      spacing: { after: 200 },
    })
  );

  // Instructions
  children.push(
    new Paragraph({
      children: [new TextRun({ text: test.instructions, italics: true, size: 20, color: "444444" })],
      spacing: { after: 400 },
    })
  );

  let qNum = 1;

  // I. Multiple Choice
  if (test.multipleChoice.length > 0) {
    children.push(heading("I. Multiple Choice", HeadingLevel.HEADING_2));
    children.push(
      body("Directions: Choose the letter of the best answer. Write your answer on the blank provided.", {
        italic: true,
      })
    );
    children.push(blank());

    test.multipleChoice.forEach((q) => {
      children.push(body(`_____ ${qNum}. ${q.question}`, { bold: true }));
      q.options.forEach((opt) => children.push(body(opt, { indent: 360 })));
      children.push(blank());
      qNum++;
    });
  }

  // II. Fill in the Blanks
  if (test.fillInTheBlanks.length > 0) {
    children.push(heading("II. Fill in the Blanks", HeadingLevel.HEADING_2));
    children.push(
      body("Directions: Write the correct word or phrase on the blank.", { italic: true })
    );
    children.push(blank());

    test.fillInTheBlanks.forEach((q) => {
      children.push(body(`${qNum}. ${q.question}`));
      children.push(blank());
      qNum++;
    });
  }

  // III. Enumeration
  if (test.enumeration.length > 0) {
    children.push(heading("III. Enumeration", HeadingLevel.HEADING_2));
    children.push(
      body("Directions: List the required items completely and in order.", { italic: true })
    );
    children.push(blank());

    test.enumeration.forEach((q) => {
      children.push(body(`${qNum}. ${q.question}`, { bold: true }));
      const lineCount = Math.max(q.answers.length, 3);
      for (let i = 1; i <= lineCount; i++) {
        children.push(body(`${String.fromCharCode(96 + i)}. ${"_".repeat(30)}`, { indent: 360 }));
      }
      children.push(blank());
      qNum++;
    });
  }

  // IV. Essay
  if (test.essay.length > 0) {
    children.push(heading("IV. Essay", HeadingLevel.HEADING_2));
    children.push(
      body("Directions: Answer each question with a well-organized essay of at least 3-5 sentences.", {
        italic: true,
      })
    );
    children.push(blank());

    test.essay.forEach((q) => {
      children.push(body(`${qNum}. ${q.question}`, { bold: true }));
      if (q.hint) children.push(body(`(Guide: ${q.hint})`, { italic: true }));
      // Answer lines
      for (let i = 0; i < 6; i++) {
        children.push(body("_".repeat(90)));
      }
      children.push(blank());
      qNum++;
    });
  }

  // -- Answer Key (new page) --
  children.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "ANSWER KEY", bold: true, size: 28 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "(For Teacher Use Only)", italics: true, size: 18, color: "888888" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  qNum = 1;

  if (test.multipleChoice.length > 0) {
    children.push(body("I. Multiple Choice", { bold: true }));
    test.multipleChoice.forEach((q) => {
      children.push(body(`${qNum}. ${q.answer}`, { indent: 360 }));
      qNum++;
    });
    children.push(blank());
  }

  if (test.fillInTheBlanks.length > 0) {
    children.push(body("II. Fill in the Blanks", { bold: true }));
    test.fillInTheBlanks.forEach((q) => {
      children.push(body(`${qNum}. ${q.answer}`, { indent: 360 }));
      qNum++;
    });
    children.push(blank());
  }

  if (test.enumeration.length > 0) {
    children.push(body("III. Enumeration", { bold: true }));
    test.enumeration.forEach((q) => {
      children.push(body(`${qNum}. ${q.question}`, { indent: 360 }));
      q.answers.forEach((a, i) =>
        children.push(body(`    ${String.fromCharCode(96 + i + 1)}. ${a}`, { indent: 720 }))
      );
      qNum++;
    });
    children.push(blank());
  }

  if (test.essay.length > 0) {
    children.push(body("IV. Essay", { bold: true }));
    test.essay.forEach((q) => {
      children.push(body(`${qNum}. (Open-ended — accept well-reasoned responses)`, { indent: 360, italic: true }));
      qNum++;
    });
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
        },
      },
    },
  });

  return Packer.toBuffer(doc);
}

// -- PDF generation --

export async function generatePdf(test: GeneratedTest): Promise<Buffer> {
  const PDFDocument = (await import("pdfkit")).default;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = doc.page.width - 120; // usable width

    // -- Header --
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .fillColor("#111111")
      .text(test.title, { align: "center", width: W });

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#888888")
      .text(
        `Generated: ${new Date(test.generatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        { align: "center", width: W }
      )
      .moveDown(0.6);

    // Name / Date line
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#222222")
      .text("Name: " + "_".repeat(35) + "   Date: " + "_".repeat(18), { width: W })
      .moveDown(0.6);

    // Instructions
    doc
      .fontSize(10)
      .font("Helvetica-Oblique")
      .fillColor("#444444")
      .text(test.instructions, { width: W })
      .moveDown(1);

    doc.moveTo(60, doc.y).lineTo(doc.page.width - 60, doc.y).strokeColor("#dddddd").stroke();
    doc.moveDown(0.8);

    let qNum = 1;

    const sectionHeader = (roman: string, title: string) => {
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#167a7f")
        .text(`${roman}. ${title.toUpperCase()}`, { width: W })
        .moveDown(0.2);
    };

    const directions = (text: string) => {
      doc
        .fontSize(9)
        .font("Helvetica-Oblique")
        .fillColor("#555555")
        .text(text, { width: W })
        .moveDown(0.6);
    };

    // I. Multiple Choice
    if (test.multipleChoice.length > 0) {
      sectionHeader("I", "Multiple Choice");
      directions("Directions: Choose the letter of the best answer. Write your answer on the blank provided.");

      test.multipleChoice.forEach((q) => {
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .fillColor("#111111")
          .text(`___  ${qNum}. `, { continued: true, width: W })
          .font("Helvetica")
          .text(q.question, { width: W });

        q.options.forEach((opt) => {
          doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("#333333")
            .text(opt, { indent: 28, width: W - 28 });
        });
        doc.moveDown(0.6);
        qNum++;
      });

      doc.moveDown(0.4);
    }

    // II. Fill in the Blanks
    if (test.fillInTheBlanks.length > 0) {
      sectionHeader("II", "Fill in the Blanks");
      directions("Directions: Write the correct word or phrase on the blank.");

      test.fillInTheBlanks.forEach((q) => {
        doc
          .fontSize(11)
          .font("Helvetica")
          .fillColor("#111111")
          .text(`${qNum}. ${q.question}`, { width: W });
        doc.moveDown(0.6);
        qNum++;
      });

      doc.moveDown(0.4);
    }

    // III. Enumeration
    if (test.enumeration.length > 0) {
      sectionHeader("III", "Enumeration");
      directions("Directions: List the required items completely and in order.");

      test.enumeration.forEach((q) => {
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .fillColor("#111111")
          .text(`${qNum}. ${q.question}`, { width: W });

        const lineCount = Math.max(q.answers.length, 3);
        for (let i = 1; i <= lineCount; i++) {
          doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("#333333")
            .text(
              `    ${String.fromCharCode(96 + i)}. ${"_".repeat(35)}`,
              { indent: 20, width: W - 20 }
            );
        }
        doc.moveDown(0.5);
        qNum++;
      });

      doc.moveDown(0.4);
    }

    // IV. Essay
    if (test.essay.length > 0) {
      sectionHeader("IV", "Essay");
      directions(
        "Directions: Answer each question with a well-organized essay of at least 3-5 sentences."
      );

      test.essay.forEach((q) => {
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .fillColor("#111111")
          .text(`${qNum}. ${q.question}`, { width: W });

        if (q.hint) {
          doc
            .fontSize(9)
            .font("Helvetica-Oblique")
            .fillColor("#666666")
            .text(`Guide: ${q.hint}`, { width: W });
        }

        for (let i = 0; i < 6; i++) {
          doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("#cccccc")
            .text("_".repeat(90), { width: W });
        }
        doc.moveDown(0.6);
        qNum++;
      });
    }

    // -- Answer Key (new page) --
    doc.addPage();

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#111111")
      .text("ANSWER KEY", { align: "center", width: W })
      .moveDown(0.3);

    doc
      .fontSize(9)
      .font("Helvetica-Oblique")
      .fillColor("#888888")
      .text("(For Teacher Use Only)", { align: "center", width: W })
      .moveDown(1);

    qNum = 1;

    if (test.multipleChoice.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#167a7f").text("I. Multiple Choice").moveDown(0.3);
      test.multipleChoice.forEach((q) => {
        doc.fontSize(10).font("Helvetica").fillColor("#222222").text(`  ${qNum}. ${q.answer}`);
        qNum++;
      });
      doc.moveDown(0.6);
    }

    if (test.fillInTheBlanks.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#167a7f").text("II. Fill in the Blanks").moveDown(0.3);
      test.fillInTheBlanks.forEach((q) => {
        doc.fontSize(10).font("Helvetica").fillColor("#222222").text(`  ${qNum}. ${q.answer}`);
        qNum++;
      });
      doc.moveDown(0.6);
    }

    if (test.enumeration.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#167a7f").text("III. Enumeration").moveDown(0.3);
      test.enumeration.forEach((q) => {
        doc.fontSize(10).font("Helvetica-Bold").fillColor("#222222").text(`  ${qNum}. ${q.question}`);
        q.answers.forEach((a, i) =>
          doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("#333333")
            .text(`      ${String.fromCharCode(96 + i + 1)}. ${a}`)
        );
        qNum++;
      });
      doc.moveDown(0.6);
    }

    if (test.essay.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#167a7f").text("IV. Essay").moveDown(0.3);
      test.essay.forEach(() => {
        doc
          .fontSize(10)
          .font("Helvetica-Oblique")
          .fillColor("#555555")
          .text(`  ${qNum}. Open-ended — accept well-reasoned, document-supported responses.`);
        qNum++;
      });
    }

    doc.end();
  });
}
