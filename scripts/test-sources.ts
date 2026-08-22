async function testNewSources() {
  // 1. Cocktails via Alphabet queries on TheCocktailDB
  try {
    const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=m');
    const json = await res.json();
    console.log('Cocktails letter "m":', json.drinks?.length, 'drinks ✅');
  } catch (e: any) {
    console.log('Cocktails error:', e.message);
  }

  // 2. D&D Spells
  try {
    const res = await fetch('https://www.dnd5eapi.co/api/spells');
    const json = await res.json();
    console.log('D&D Spells list:', json.results?.length, 'spells ✅');
  } catch (e: any) {
    console.log('DnD error:', e.message);
  }
}

testNewSources();
