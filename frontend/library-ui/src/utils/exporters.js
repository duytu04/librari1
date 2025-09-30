function headersFrom(rows){
  return Array.from(new Set(rows.flatMap(r => Object.keys(r))));
}
function escapeCsv(v){
  if (v === null || v === undefined) return "";
  return String(v).replace(/"/g,'""');
}
export function makeCsv(rows){
  if (!rows?.length) return "";
  const headers = headersFrom(rows);
  const lines = [headers.join(",")].concat(
    rows.map(r => headers.map(h => `"${escapeCsv(r[h])}"`).join(","))
  );
  return lines.join("\n");
}
export function downloadCsv(rows, filename="export.csv"){
  const csv = makeCsv(rows);
  const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
export async function copyJson(rows){
  await navigator.clipboard.writeText(JSON.stringify(rows ?? [], null, 2));
}
