import { jsPDF } from "jspdf";

export interface Contributor {
  name: string;
  role: string;
  splitPct: number;
  signed: boolean;
}

export interface Release {
  title: string;
  bpm: number | null;
  key: string | null;
  genre: string | null;
  sessionId: string;
}

export async function generateSplitPdf(
  release: Release,
  contributors: Contributor[]
): Promise<{ blob: Blob; hash: string }> {
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(46, 230, 46);
  doc.text("DIMI - Split Sheet", 72, 80);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Release: ${release.title}`, 72, 110);
  doc.text(
    `BPM: ${release.bpm ?? "-"}  -  Key: ${release.key ?? "-"}  -  Genre: ${release.genre ?? "-"}`,
    72,
    128
  );
  doc.text(`Session ID: ${release.sessionId}`, 72, 146);
  doc.text(`Generated: ${new Date().toISOString()}`, 72, 164);

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.line(72, 178, 540, 178);

  // Table header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Name", 72, 200);
  doc.text("Role", 250, 200);
  doc.text("Split %", 380, 200);
  doc.text("Signed", 460, 200);

  doc.line(72, 208, 540, 208);

  // Rows
  doc.setFont("helvetica", "normal");
  contributors.forEach((c, i) => {
    const y = 226 + i * 22;
    doc.text(c.name, 72, y);
    doc.text(c.role, 250, y);
    doc.text(`${c.splitPct}%`, 380, y);
    doc.text(c.signed ? "Yes" : "No", 460, y);
  });

  // Footer
  const totalY = 226 + contributors.length * 22 + 20;
  doc.line(72, totalY, 540, totalY);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total: ${contributors.reduce((acc, c) => acc + c.splitPct, 0)}%`,
    380,
    totalY + 16
  );

  const blob = doc.output("blob");

  // SHA-256 hash of the PDF bytes
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return { blob, hash };
}
