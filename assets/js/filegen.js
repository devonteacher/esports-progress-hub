/* Esports Progress Hub — offline Office/PDF file generation (no external libraries).
   Produces valid .xlsx and .docx via a minimal in-browser ZIP writer. */

/* ===================== FILE GENERATION (offline, no libraries) ===================== */
const CRC_TABLE=(()=>{let c,t=[];for(let n=0;n<256;n++){c=n;for(let k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);t[n]=c>>>0;}return t;})();
function crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC_TABLE[(c^b[i])&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function strU8(s){return new TextEncoder().encode(s);}
function makeZip(files){
  const u16=n=>[n&0xFF,(n>>8)&0xFF], u32=n=>[n&0xFF,(n>>8)&0xFF,(n>>16)&0xFF,(n>>24)&0xFF];
  const chunks=[], central=[]; let offset=0;
  files.forEach(f=>{
    const name=strU8(f.name), data=f.data, crc=crc32(data), size=data.length;
    const local=new Uint8Array([].concat(u32(0x04034b50),u16(20),u16(0),u16(0),u16(0),u16(0x21),u32(crc),u32(size),u32(size),u16(name.length),u16(0)));
    chunks.push(local,name,data);
    const cen=new Uint8Array([].concat(u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0x21),u32(crc),u32(size),u32(size),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset)));
    central.push({h:cen,n:name});
    offset+=local.length+name.length+data.length;
  });
  const cStart=offset; let cSize=0;
  central.forEach(c=>{chunks.push(c.h,c.n);cSize+=c.h.length+c.n.length;});
  chunks.push(new Uint8Array([].concat(u32(0x06054b50),u16(0),u16(0),u16(central.length),u16(central.length),u32(cSize),u32(cStart),u16(0))));
  let total=chunks.reduce((s,c)=>s+c.length,0), out=new Uint8Array(total), p=0;
  chunks.forEach(c=>{out.set(c,p);p+=c.length;});
  return out;
}
function xmlEsc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
function downloadBytes(bytes,filename,mime){
  const blob=new Blob([bytes],{type:mime}), url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},150);
}

/* ----- XLSX ----- */
function colRef(i){let s='';i++;while(i>0){let m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26);}return s;}
function buildXlsx(title,headers,rows,opts){
  opts=opts||{};
  if(Array.isArray(opts)) opts={widths:opts}; // backward compat
  const widths=opts.widths;
  const statusCol=(opts.statusCol!=null)?opts.statusCol:-1;
  const statusColours=opts.statusColours||{};
  // build a stable list of status fill colours -> xf index (start at 2)
  const statusKeys=Object.keys(statusColours);
  const statusXf={}; statusKeys.forEach((k,i)=>statusXf[k]=2+i);
  const allRows=[headers,...rows];
  let sheet='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
  if(widths){sheet+='<cols>'+widths.map((w,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>').join('')+'</cols>';}
  sheet+='<sheetData>';
  allRows.forEach((r,ri)=>{
    sheet+='<row r="'+(ri+1)+'">';
    r.forEach((cell,ci)=>{
      let s=ri===0?1:0;
      if(ri>0 && ci===statusCol && statusXf[cell]!=null) s=statusXf[cell];
      sheet+='<c r="'+colRef(ci)+(ri+1)+'" t="inlineStr" s="'+s+'"><is><t xml:space="preserve">'+xmlEsc(cell)+'</t></is></c>';
    });
    sheet+='</row>';
  });
  sheet+='</sheetData></worksheet>';
  const baseFills=3; // none, gray125, header navy
  const fillsXml=statusKeys.map(k=>'<fill><patternFill patternType="solid"><fgColor rgb="'+statusColours[k]+'"/></patternFill></fill>').join('');
  const xfsXml=statusKeys.map(k=>'<xf numFmtId="0" fontId="0" fillId="'+(baseFills+statusKeys.indexOf(k))+'" borderId="0" xfId="0" applyAlignment="1" applyFill="1"><alignment vertical="top" wrapText="1"/></xf>').join('');
  const styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
    '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts>'+
    '<fills count="'+(baseFills+statusKeys.length)+'"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0F2A4A"/></patternFill></fill>'+fillsXml+'</fills>'+
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'+
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'+
    '<cellXfs count="'+(2+statusKeys.length)+'"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'+
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>'+xfsXml+'</cellXfs>'+
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  const files=[
    {name:'[Content_Types].xml',data:strU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>')},
    {name:'_rels/.rels',data:strU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>')},
    {name:'xl/workbook.xml',data:strU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="'+xmlEsc(title.slice(0,28))+'" sheetId="1" r:id="rId1"/></sheets></workbook>')},
    {name:'xl/_rels/workbook.xml.rels',data:strU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>')},
    {name:'xl/styles.xml',data:strU8(styles)},
    {name:'xl/worksheets/sheet1.xml',data:strU8(sheet)}
  ];
  return makeZip(files);
}

/* ----- DOCX (A4 landscape, title + table) ----- */
function buildDocx(title,meta,headers,rows,opts){
  opts=opts||{};
  const statusCol=(opts.statusCol!=null)?opts.statusCol:-1;
  const statusColours=opts.statusColours||{};
  function runs(text,o){o=o||{};return '<w:r><w:rPr>'+(o.b?'<w:b/>':'')+(o.color?'<w:color w:val="'+o.color+'"/>':'')+'<w:sz w:val="'+(o.sz||22)+'"/><w:rFonts w:ascii="Calibri" w:hAscii="Calibri"/></w:rPr><w:t xml:space="preserve">'+xmlEsc(text)+'</w:t></w:r>';}
  function para(text,o){o=o||{};return '<w:p><w:pPr>'+(o.heading?'<w:spacing w:after="120"/>':'')+'</w:pPr>'+runs(text,o)+'</w:p>';}
  function cell(text,o){o=o||{};return '<w:tc><w:tcPr><w:tcW w:w="'+(o.w||1500)+'" w:type="dxa"/>'+(o.shd?'<w:shd w:val="clear" w:fill="'+o.shd+'"/>':'')+'<w:tcMar><w:top w:w="60" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tcMar></w:tcPr>'+para(text,o)+'</w:tc>';}
  const widths=[1400,2600,1500,1600,1300,1500,3000];
  let tbl='<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="D8E0E8"/><w:left w:val="single" w:sz="4" w:color="D8E0E8"/><w:bottom w:val="single" w:sz="4" w:color="D8E0E8"/><w:right w:val="single" w:sz="4" w:color="D8E0E8"/><w:insideH w:val="single" w:sz="4" w:color="D8E0E8"/><w:insideV w:val="single" w:sz="4" w:color="D8E0E8"/></w:tblBorders></w:tblPr>';
  tbl+='<w:tr>'+headers.map((h,i)=>cell(h,{b:true,color:'FFFFFF',shd:'0F2A4A',w:widths[i],sz:20})).join('')+'</w:tr>';
  rows.forEach(r=>{tbl+='<w:tr>'+r.map((cv,i)=>{
    const o={w:widths[i],sz:20};
    if(i===statusCol && statusColours[cv]){o.shd=statusColours[cv];o.b=true;}
    return cell(cv,o);
  }).join('')+'</w:tr>';});
  tbl+='</w:tbl>';
  const body='<w:p><w:pPr><w:spacing w:after="40"/></w:pPr>'+runs(title,{b:true,sz:36,color:'0F2A4A'})+'</w:p>'+
    '<w:p><w:pPr><w:spacing w:after="160"/></w:pPr>'+runs(meta,{sz:20,color:'5A6B7C'})+'</w:p>'+tbl+
    '<w:p><w:pPr><w:spacing w:before="200"/></w:pPr>'+runs('Tip: work backwards from each deadline — set your draft-complete date a few days earlier, and always meet the first deadline to keep a resubmission possible.',{sz:18,color:'5A6B7C'})+'</w:p>'+
    '<w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/></w:sectPr>';
  const doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'</w:body></w:document>';
  const files=[
    {name:'[Content_Types].xml',data:strU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')},
    {name:'_rels/.rels',data:strU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')},
    {name:'word/document.xml',data:strU8(doc)}
  ];
  return makeZip(files);
}
