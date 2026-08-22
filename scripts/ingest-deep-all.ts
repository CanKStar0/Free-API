/**
 * FreeAPI Enterprise Deep Master Dataset Ingestion Suite
 * Fetches and enriches ALL datasets with maximal field depth and hyper-detailed attributes.
 */

import fs from 'fs';
import path from 'path';

const DATASETS_DIR = path.join(process.cwd(), 'database', 'datasets');

if (!fs.existsSync(DATASETS_DIR)) {
  fs.mkdirSync(DATASETS_DIR, { recursive: true });
}

interface DatasetSpec {
  slug: string;
  name: string;
  categoryId: string;
  sourceUrl: string;
  isStatic: boolean;
  version: string;
  metadata: {
    description: string;
    license: string;
    homepage: string;
    primaryKey: string;
    searchableFields: string[];
    filterFields: string[];
  };
  fetcher: () => Promise<any[]>;
}

const SPECS: DatasetSpec[] = [
  // 1. Complete Mixology & Cocktail Recipes (600+ Cocktails)
  {
    slug: 'cocktails-recipes',
    name: 'Cocktails & Mixology Database (Hyper-Detailed)',
    categoryId: 'food',
    sourceUrl: 'https://www.thecocktaildb.com',
    isStatic: true,
    version: '2.0.0',
    metadata: {
      description: 'Complete mixology guide of 600+ cocktails with exact ingredient measures (oz/ml), recommended glass types, preparation instructions in multiple languages, and high-res thumbnails.',
      license: 'TheCocktailDB Open API',
      homepage: 'https://www.thecocktaildb.com',
      primaryKey: 'idDrink',
      searchableFields: ['strDrink', 'strCategory', 'strAlcoholic', 'strGlass'],
      filterFields: ['strCategory', 'strAlcoholic', 'strGlass'],
    },
    fetcher: async () => {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
      const allDrinks: any[] = [];
      const seenIds = new Set<string>();

      for (const char of alphabet) {
        try {
          const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${char}`, { signal: AbortSignal.timeout(5000) });
          if (res.ok) {
            const json = await res.json();
            if (json.drinks) {
              for (const d of json.drinks) {
                if (!seenIds.has(d.idDrink)) {
                  seenIds.add(d.idDrink);

                  // Extract clean ingredients and measurements
                  const ingredients = [];
                  for (let i = 1; i <= 15; i++) {
                    const ing = d[`strIngredient${i}`];
                    const measure = d[`strMeasure${i}`];
                    if (ing && ing.trim()) {
                      ingredients.push({
                        ingredient: ing.trim(),
                        measure: measure ? measure.trim() : 'to taste',
                      });
                    }
                  }

                  allDrinks.push({
                    idDrink: d.idDrink,
                    name: d.strDrink,
                    category: d.strCategory || 'Cocktail',
                    alcoholic: d.strAlcoholic || 'Alcoholic',
                    glass: d.strGlass || 'Cocktail glass',
                    instructions: d.strInstructions || '',
                    instructionsDe: d.strInstructionsDE || null,
                    instructionsIt: d.strInstructionsIT || null,
                    thumbnail: d.strDrinkThumb || '',
                    ingredients,
                    totalIngredients: ingredients.length,
                    dateModified: d.dateModified || new Date().toISOString(),
                  });
                }
              }
            }
          }
        } catch {}
      }

      if (allDrinks.length > 50) return allDrinks;
      throw new Error('Cocktail alphabet crawl failed');
    },
  },

  // 2. Dungeons & Dragons 5e Magic Spells (319+ Spells)
  {
    slug: 'dnd-5e-spells',
    name: 'Dungeons & Dragons 5e Spells Compendium (Hyper-Detailed)',
    categoryId: 'gaming',
    sourceUrl: 'https://www.dnd5eapi.co',
    isStatic: true,
    version: '2.0.0',
    metadata: {
      description: 'Complete 5th Edition D&D spellbook with casting times, ranges, V/S/M components, durations, concentration/ritual tags, higher-level scaling, and spell descriptions.',
      license: 'Wizards of the Coast Open Gaming License (OGL)',
      homepage: 'https://www.dnd5eapi.co',
      primaryKey: 'index',
      searchableFields: ['name', 'school.name', 'level'],
      filterFields: ['level', 'school.name', 'ritual', 'concentration'],
    },
    fetcher: async () => {
      const res = await fetch('https://www.dnd5eapi.co/api/spells', { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error('DnD index fetch failed');
      const index = await res.json();
      const spellSummaries = index.results || [];

      // Fetch full details in batches of 20
      const detailedSpells: any[] = [];
      const batchSize = 25;

      for (let i = 0; i < spellSummaries.length; i += batchSize) {
        const batch = spellSummaries.slice(i, i + batchSize);
        const promises = batch.map(async (item: any) => {
          try {
            const sRes = await fetch(`https://www.dnd5eapi.co${item.url}`, { signal: AbortSignal.timeout(8000) });
            if (sRes.ok) return await sRes.json();
          } catch {}
          return null;
        });

        const results = await Promise.all(promises);
        for (const s of results) {
          if (s) {
            detailedSpells.push({
              index: s.index,
              name: s.name,
              level: s.level,
              school: s.school?.name || 'Universal',
              castingTime: s.casting_time,
              range: s.range,
              components: s.components || [],
              material: s.material || null,
              duration: s.duration,
              concentration: s.concentration || false,
              ritual: s.ritual || false,
              classes: s.classes?.map((c: any) => c.name) || [],
              subclasses: s.subclasses?.map((sc: any) => sc.name) || [],
              description: Array.isArray(s.desc) ? s.desc.join('\n\n') : (s.desc || ''),
              higherLevel: s.higher_level ? (Array.isArray(s.higher_level) ? s.higher_level.join('\n') : s.higher_level) : null,
            });
          }
        }
      }

      if (detailedSpells.length > 50) return detailedSpells;
      throw new Error('DnD batch fetch failed');
    },
  },
];

async function runDeepIngestion() {
  console.log('🚀 ================================================================');
  console.log('🚀 FreeAPI Deep Master Ingestion (Cocktails, Spells & Full Metadata)');
  console.log('🚀 ================================================================\n');

  for (const spec of SPECS) {
    const start = Date.now();
    try {
      console.log(`📦 Fetching deep records for [${spec.slug}]...`);
      const data = await spec.fetcher();

      const rawJson = JSON.stringify(data);
      const byteSize = Buffer.byteLength(rawJson);
      const mbSize = (byteSize / (1024 * 1024)).toFixed(2);
      const kbSize = (byteSize / 1024).toFixed(1);

      const datasetDoc = {
        id: `fapi_ds_${spec.slug}`,
        slug: spec.slug,
        category_id: spec.categoryId,
        name: spec.name,
        source_url: spec.sourceUrl,
        is_static: spec.isStatic,
        version: spec.version,
        record_count: data.length,
        data_json: data,
        metadata_json: {
          ...spec.metadata,
          totalBytes: byteSize,
          sizeFormatted: byteSize > 1024 * 1024 ? `${mbSize} MB` : `${kbSize} KB`,
        },
        status: 'ready',
        last_synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const targetFile = path.join(DATASETS_DIR, `${spec.slug}.json`);
      fs.writeFileSync(targetFile, JSON.stringify(datasetDoc, null, 2), 'utf-8');

      const elapsed = Date.now() - start;
      console.log(`✅ [${spec.slug}] Successfully saved ${data.length.toLocaleString()} hyper-detailed records (${datasetDoc.metadata_json.sizeFormatted}) in ${elapsed}ms`);
    } catch (err: any) {
      console.error(`❌ [${spec.slug}] Error: ${err.message}`);
    }
  }

  console.log('\n================================================================');
  console.log('🎉 DEEP MASTER INGESTION COMPLETED!');
  console.log('================================================================');
}

runDeepIngestion().catch(console.error);
