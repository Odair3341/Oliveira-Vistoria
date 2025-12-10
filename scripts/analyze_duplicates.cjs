
const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-empty-forest-acjt0u7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixDuplicates() {
  const client = await pool.connect();
  try {
    // List all inspections to identify duplicates or extra records
    const res = await client.query('SELECT id, placa, valor_total, data_vistoria FROM vistorias ORDER BY placa, data_vistoria');
    
    // Specifically looking for OOK-7812 vs QOK-7812 (possible typo) or QAQ-1B59 which might be the extra one
    // User image shows 19 rows.
    // My list shows 20.
    
    // Let's look for duplicates or similar plates
    // QOK-7812 appears in my list (id: 77521b28...) with 217.84
    // OOK-7812 appears in my list (id: 9c3a763e...) with 683.14
    
    // In the user's image, I see "OOK-7812" (line 15 of image) with R$ 217.84
    // Wait, let me check the image again...
    // The image provided by user shows:
    // ...
    // OOK-7812 | 154224 | 2014 | UNO VIVACE 1.0 | ... | R$ 217.84
    
    // But in my database list I have:
    // OOK-7812 with 683.14
    // QOK-7812 with 217.84
    
    // It seems "QOK-7812" might be the correct one or vice-versa, but having both is likely the issue.
    // The mock data had "QOK-7812" with 683.14 (line 259 of mockInspections.ts)
    // Let's see the user's image carefully...
    // The user's image lists "OOK-7812" at the bottom part? No, middle.
    // And "QAQ-1B59" is in the image too?
    
    // Let's remove the one that looks like a duplicate or error.
    // QOK-7812 (217.84) vs OOK-7812 (683.14).
    // In mock data: QOK-7812 has 683.14.
    // So OOK-7812 (683.14) seems to match the mock data value but with a typo in Plate?
    // Or QOK-7812 (217.84) is a new one?
    
    // Let's delete the one with QOK-7812 if OOK-7812 is the intended one, or vice-versa.
    // Actually, "QOK" is a valid plate pattern. "OOK" is also valid.
    // But typically these are typos.
    
    // Let's delete "QOK-7812" with value 217.84 because it seems to be the extra one (20th).
    // And let's check if OOK-7812 needs to be corrected to QOK-7812?
    // In mockInspections.ts line 259: "placa": "QOK-7812" with total 683.14.
    // So QOK-7812 is the correct plate.
    // In my DB I have OOK-7812 with 683.14. This is a typo in DB.
    // And I have another QOK-7812 with 217.84.
    
    // Plan:
    // 1. Delete QOK-7812 (217.84) - likely a duplicate creation attempt.
    // 2. Rename OOK-7812 (683.14) to QOK-7812 (correct plate, correct value).
    // OR
    // If user says "nem o valor ta batendo", and total should be 6149.76.
    
    // Current total: 6213.92
    // Target: 6149.76
    // Diff: 64.16
    
    // If I delete QOK-7812 (217.84): Total = 5996.08 (Too low)
    // If I delete OOK-7812 (683.14): Total = 5530.78 (Too low)
    
    // Wait, let's look at QAQ-1B59 (217.84).
    // If I delete QAQ-1B59: Total = 5996.08
    
    // Let's verify the "XYZ-9876" record I added previously? It is NOT in the list of 20 I just printed!
    // Ah! I updated XYZ-9876 in previous turn. Where did it go?
    // Maybe it was deleted or I missed it?
    // Let me check the list again.
    
    // The list in previous tool output:
    // ...
    // QAQ-1B59
    // QOK-7812 (217.84)
    // ...
    // No XYZ-9876.
    
    // Wait, I see "OOK-7812" with 683.14.
    // And "QOK-7812" with 217.84.
    
    // Let's try to remove QOK-7812 (217.84) AND QAQ-1B59 (217.84) -> -435.68
    // Total 6213.92 - 435.68 = 5778.24.
    // Plus the missing XYZ-9876 (371.52) = 6149.76.
    
    // Bingo!
    // The XYZ-9876 is missing (maybe I deleted it or it wasn't saved?).
    // And we have 2 extra records: QAQ-1B59 and QOK-7812 (duplicate of OOK/QOK).
    
    // But wait, the user image shows QAQ-1B59. So maybe that one should stay?
    // "QAQ-1B59" appears in the user image as "Pendente".
    // And "OOK-7812" appears in user image? No, I need to look closer at user image.
    // User image:
    // QAE-6580
    // QIQ-1024
    // QIO-7756
    // QAH-5183
    // BBT-5H62
    // QAM-6763
    // QAM-0651
    // QAQ-7235
    // EVA-4790
    // ETE-0314
    // QTM-3A04
    // QJY-3266
    // RAG-4166
    // OOK-7812 (Yes, OOK is in the image! With 217.84) -> Wait, in my DB OOK has 683.14!
    // RMQ-3I67
    // QAQ-1B59 (Yes, in image)
    // QAQ-0658
    // QAL-0387
    // QAM-6764
    
    // That's 19 items in the image.
    
    // Discrepancies:
    // 1. My DB has "OOK-7812" with 683.14. Image says 217.84.
    // 2. My DB has "QOK-7812" with 217.84. Image does NOT have QOK.
    // 3. My DB has 20 items. Image has 19.
    
    // So QOK-7812 is the extra one? Or OOK?
    // The image has "OOK-7812".
    // But the mock data had "QOK-7812" with 683.14.
    
    // If I keep OOK-7812 and update its value to 217.84 (as per image)?
    // And delete QOK-7812?
    
    // Let's recalculate target sum.
    // 18 items at 217.84 = 3921.12
    // + 1 item (OOK) at 217.84? = 4138.96
    // This is far from 6149.76.
    
    // The user said: "Valor total: R$ 6.149,76" is the goal.
    // In mock data:
    // QOK-7812 was 683.14.
    // QAE-6580 was 574.24.
    // EVA-4790 was 507.14.
    // QAM-0651 was 641.34.
    // QIO-7756 was 415.84.
    // QAQ-7235 was 342.14.
    // The rest were 217.84 (approx).
    
    // Let's verify values in DB vs Mock.
    // QAE-6580: DB 574.24 (OK)
    // EVA-4790: DB 507.14 (OK)
    // QAM-0651: DB 641.34 (OK)
    // QIO-7756: DB 415.84 (OK)
    // QAQ-7235: DB 342.14 (OK)
    // OOK-7812: DB 683.14 (Matches QOK-7812 mock value).
    
    // So OOK-7812 in DB is correct value-wise (683.14) according to Mock.
    // But user image shows OOK-7812 with 217.84? 
    // Wait, the user image row for OOK-7812:
    // "OOK-7812 ... 154224 ... 2014 ... R$ 217.84"
    // This looks like the user manually changed it or the image is misleading/different.
    
    // BUT, the user said "nem o valor ta batendo agora".
    // And earlier "Valor total: R$ 6.149,76".
    
    // If I have 20 items.
    // I need to remove 1 item to get 19.
    // And ensure total is 6149.76.
    
    // Current Total: 6213.92.
    // Target: 6149.76.
    // Difference: 64.16.
    
    // No single item has value 64.16.
    
    // This means I likely need to delete one item AND update another, or delete multiple and add one.
    
    // Let's look at QOK-7812 (217.84) and OOK-7812 (683.14).
    // If I delete QOK-7812 (217.84): Total = 5996.08.
    // Missing to reach 6149.76: 153.68.
    
    // If I delete OOK-7812 (683.14): Total = 5530.78.
    // Missing: 618.98.
    
    // Let's check "XYZ-9876". I don't see it in the DB list.
    // Did I successfully update it? Yes, logs said "Updated rows: 1".
    // But then where is it?
    // Ah, `check_current_inspections.cjs` output showed 20 items.
    // Maybe XYZ-9876 is NOT in the list?
    // Let's check the list again very carefully.
    // ...
    // No XYZ.
    
    // Maybe I should look for it specifically.
    // And also, the user wants 19 items.
    
    // Let's look at "QAQ-1B59" (217.84). This seems to be the "extra" one that appeared in the screenshot.
    // If I delete it, I'm back to the set that (presumably) had XYZ.
    
    // Let's try to find XYZ-9876 specifically.
    const xyz = await client.query("SELECT * FROM vistorias WHERE placa = 'XYZ-9876'");
    console.log('XYZ-9876 count:', xyz.rowCount);
    
    // If XYZ is gone, and we have 20 items.
    // We need to identify which one to remove to get 19 valid ones.
    // And ensure total matches.
    
    // Let's assume OOK-7812 should be QOK-7812 with 683.14 (based on mock).
    // The user image having 217.84 for OOK might be an error in their manual entry or screenshot.
    
    // Let's delete "QOK-7812" (217.84) which is likely the duplicate/wrong one.
    // Let's delete "QAQ-1B59" (217.84) if it's considered "extra" or "wrong"?
    // User asked "VE AI QUAL CARRO ESTA ERRADO".
    
    // Let's dump all plates and values to a file to analyze better.
    const all = await client.query('SELECT id, placa, valor_total FROM vistorias');
    console.log(JSON.stringify(all.rows, null, 2));
    
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

fixDuplicates();
