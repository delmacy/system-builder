import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { renderToStaticMarkup } from 'react-dom/server';
import { LEGACY_ICON_TOKENS, ICON_TOKENS, SEMANTIC_ICON_CATALOG, StationIcon, StationGlyph } from '../../packages/ui-icons/index.js';
import { ICON_CATALOG_METADATA } from '../../packages/ui-icons/catalog-metadata.js';
import { createIconAssetLoader, loadIconAsset, normalizeIconReference, searchIconCatalog, iconAssetMetadata } from '../../packages/ui-icons/catalog-runtime.js';
const geometry=(createRequire(__filename)('../../scripts/generate-station-icon-library.mjs') as {geometry:(svg:string)=>readonly unknown[]}).geometry;
const sha=(s:string)=>createHash('sha256').update(s).digest('hex');
test('all pinned source assets and generated geometry match actual upstream blobs and render through shared React glyph',async()=>{
 const snapshot=JSON.parse(await readFile('packages/ui-icons/vendor/lucide-snapshot.json','utf8')) as {revision:string;assets:readonly {name:string;svg:string;gitBlobSha:string;bytes:number}[]};
 const manifest=JSON.parse(await readFile('packages/ui-icons/vendor/source-manifest.json','utf8')) as {sourceDigest:string};
 assert.equal(snapshot.revision,'70562c1ee1c4fdcf736fe97bc893fb8511927934');assert.equal(snapshot.assets.length,1877);assert.equal(ICON_CATALOG_METADATA.length,1879);assert.equal(sha(JSON.stringify(snapshot)),manifest.sourceDigest);
 for(const asset of snapshot.assets){const b=Buffer.from(asset.svg);assert.equal(b.length,asset.bytes);assert.equal(createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex'),asset.gitBlobSha);
  const shapes=geometry(asset.svg),ref={catalogVersion:'1.0.0',assetRef:'glyph:'+asset.name},loaded=await loadIconAsset(ref);assert.equal(loaded.status,'ready');if(loaded.status!=='ready')throw Error(asset.name);
  assert.equal(loaded.definition.digest,sha(JSON.stringify(shapes)));assert.deepEqual(loaded.definition.shapes,shapes);
  const svg=renderToStaticMarkup(StationGlyph({definition:loaded.definition,label:asset.name}));assert.match(svg,/stroke="currentColor"/);assert.match(svg,/role="img"/);assert.doesNotMatch(svg,/<script|<foreignObject|onload=|href=/i);
 }
});
test('all semantic roles and two directional custom assets resolve without regressions in legacy tokens',async()=>{
 assert.equal(LEGACY_ICON_TOKENS.length,28);assert.equal(Object.keys(SEMANTIC_ICON_CATALOG).length,235);assert.equal(ICON_TOKENS.length,261);
 for(const row of Object.values(SEMANTIC_ICON_CATALOG)){const loaded=await loadIconAsset({assetRef:row.assetRef,catalogVersion:row.catalogVersion});assert.equal(loaded.status,'ready');if(loaded.status!=='ready')throw Error(row.token);const svg=renderToStaticMarkup(StationIcon({token:row.token}));assert.match(svg,/aria-hidden="true"/);assert.match(svg,/stroke="currentColor"/);}
 for(const token of ['object.flip-horizontal','object.flip-vertical'] as const){const svg=renderToStaticMarkup(StationIcon({token}));assert.match(svg,/data-icon-provider="station"/);}
 for(const token of LEGACY_ICON_TOKENS)assert.match(renderToStaticMarkup(StationIcon({token})),/data-icon-provider="lucide"/);
});
test('catalog searches PT accents, semantic roles, exact names and paginates the complete metadata',()=>{
 assert.ok(searchIconCatalog('salvar').items.some(x=>x.name==='save'));assert.ok(searchIconCatalog('font.increase').items.some(x=>x.name==='a-arrow-up'));assert.ok(searchIconCatalog('alinhar direita').items.length);
 const first=searchIconCatalog('',{limit:96}),second=searchIconCatalog('',{limit:96,offset:first.nextOffset!});assert.equal(first.items.length,96);assert.equal(second.items.length,96);assert.equal(new Set([...first.items,...second.items].map(x=>x.assetRef)).size,192);
 assert.equal(searchIconCatalog('',{category:'layers'}).items.some(x=>x.name==='bring-to-front'),true);assert.equal(searchIconCatalog('no such glyph').total,0);assert.equal(Object.isFrozen(first.items),true);
 for(const options of [{limit:0},{limit:97},{offset:-1},{offset:1.5},{category:'unknown'}])assert.throws(()=>searchIconCatalog('',options));assert.throws(()=>searchIconCatalog('x'.repeat(129)));
});
test('source parser rejects scripts, event attributes, external resources and malformed geometry',()=>{
 for(const source of ['<svg><script/></svg>','<!DOCTYPE svg><svg/>','<svg onload="x"/>','<svg><image href="https://foreign"/></svg>'])assert.throws(()=>geometry(source));
});
test('version, unsafe reference, mutated geometry and unavailable loads never produce ready or latest fallback',async()=>{
 const ref={catalogVersion:'1.0.0',assetRef:'glyph:save'},real=await loadIconAsset(ref);assert.equal(real.status,'ready');if(real.status!=='ready')throw Error('fixture');
 assert.equal((await loadIconAsset({...ref,catalogVersion:'2.0.0'})).status,'unsupported-version');assert.equal((await loadIconAsset({...ref,assetRef:'glyph:not-installed'})).status,'missing');assert.equal((await loadIconAsset({...ref,assetRef:'https://foreign/icon.svg'})).status,'invalid-reference');
 let invoked=false;const hostile=Object.defineProperty({...ref},'assetRef',{enumerable:true,get(){invoked=true;throw Error('getter');}});assert.equal(normalizeIconReference(hostile),null);assert.equal(invoked,false);
 const altered={...real.definition,shapes:[['path',{d:'M1 1h2'}]]} as unknown as typeof real.definition;
 assert.equal((await createIconAssetLoader(async()=>({[ref.assetRef]:altered})).load(ref)).status,'unavailable');
 const executable={...real.definition,shapes:[['path',{d:'M1 1h2',onload:'evil'}]]} as unknown as typeof real.definition;
 assert.equal((await createIconAssetLoader(async()=>({[ref.assetRef]:executable})).load(ref)).status,'unavailable');
 const getter=Object.defineProperty({...real.definition},'shapes',{enumerable:true,get(){invoked=true;throw Error('getter');}});assert.equal((await createIconAssetLoader(async()=>({[ref.assetRef]:getter})).load(ref)).status,'unavailable');assert.equal(invoked,false);
 assert.equal(iconAssetMetadata({...ref,catalogVersion:'2.0.0'}),null);
});
test('concurrent cache loads deduplicate immutable actual assets and transient failures can retry',async()=>{
 const ref={catalogVersion:'1.0.0',assetRef:'glyph:save'},real=await loadIconAsset(ref);assert.equal(real.status,'ready');if(real.status!=='ready')throw Error('fixture');let calls=0;
 const loader=createIconAssetLoader(async()=>{calls++;return{[ref.assetRef]:real.definition};});const[a,b]=await Promise.all([loader.load(ref),loader.load(ref)]);assert.equal(calls,1);assert.strictEqual(a,b);assert.equal(loader.cachedCount(),1);if(a.status==='ready')assert.ok(Object.isFrozen(a.definition.shapes[0]![1]));
 let attempts=0;const retry=createIconAssetLoader(async()=>{if(++attempts===1)throw Error('unavailable');return{[ref.assetRef]:real.definition};});assert.equal((await retry.load(ref)).status,'unavailable');assert.equal(retry.cachedCount(),0);assert.equal((await retry.load(ref)).status,'ready');assert.equal(attempts,2);
});
