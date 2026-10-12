import type { LucideIconDefinition } from './lucide-adapter.js';
import { ICON_CATALOG_CATEGORIES, ICON_CATALOG_METADATA, ICON_CATALOG_VERSION, type IconCatalogMetadata } from './catalog-metadata.js';
export { ICON_CATALOG_CATEGORIES, ICON_CATALOG_VERSION } from './catalog-metadata.js';
export interface IconAssetReference { readonly catalogVersion: string; readonly assetRef: string }
export interface IconAssetDefinition extends LucideIconDefinition { readonly assetRef: string; readonly catalogVersion: string; readonly provider: 'lucide'|'station'; readonly digest: string }
export type IconAssetResult = Readonly<{ status:'ready'; definition:IconAssetDefinition }> | Readonly<{status:'missing'|'unsupported-version'|'unavailable'|'invalid-reference'}>;
const metadataByRef=new Map(ICON_CATALOG_METADATA.map(row=>[row.assetRef,row]));
const object=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v);
export function normalizeIconReference(value:unknown):IconAssetReference|null {
 try {
 if(!object(value)||Object.getPrototypeOf(value)!==Object.prototype||Object.getOwnPropertySymbols(value).length)return null;
 const descriptors=Object.getOwnPropertyDescriptors(value);
 if(Object.keys(descriptors).sort().join(',')!=='assetRef,catalogVersion'||Object.values(descriptors).some(d=>!d.enumerable||!Object.hasOwn(d,'value')))return null;
 const assetRef=descriptors.assetRef!.value as unknown,catalogVersion=descriptors.catalogVersion!.value as unknown;
 return typeof assetRef==='string'&&/^glyph:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(assetRef)&&assetRef.length<=128&&typeof catalogVersion==='string'&&catalogVersion.length<=32&&/^\d+\.\d+\.\d+$/.test(catalogVersion)?Object.freeze({assetRef,catalogVersion}):null;
 }catch{return null;}
}
export function iconAssetMetadata(reference:IconAssetReference):IconCatalogMetadata|null {const r=normalizeIconReference(reference);return r?.catalogVersion===ICON_CATALOG_VERSION?metadataByRef.get(r.assetRef)??null:null;}
const fold=(v:string)=>v.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('en');
export function searchIconCatalog(query='',options:Readonly<{category?:string;offset?:number;limit?:number}>={}) {
 if(typeof query!=='string'||query.length>128||/[\p{Cc}]/u.test(query))throw Error('ICON_SEARCH_INVALID');
 const offset=options.offset??0,limit=options.limit??48;
 if(!Number.isSafeInteger(offset)||offset<0||!Number.isInteger(limit)||limit<1||limit>96||options.category!==undefined&&!ICON_CATALOG_CATEGORIES.some(c=>c===options.category))throw Error('ICON_PAGE_INVALID');
 const terms=fold(query.trim()).split(/\s+/).filter(Boolean);
 const matches=ICON_CATALOG_METADATA.filter(row=>(options.category===undefined||row.roles.some(r=>r.category===options.category))&&terms.every(t=>fold([row.name,row.assetRef,...row.roles.flatMap(r=>[r.token,r.label,r.category])].join(' ')).includes(t)));
 return Object.freeze({catalogVersion:ICON_CATALOG_VERSION,total:matches.length,offset,limit,nextOffset:offset+limit<matches.length?offset+limit:null,items:Object.freeze(matches.slice(offset,offset+limit))});
}
export const ICON_SHARD_LOADERS=Object.freeze({
 0:()=>import('./generated/catalog-0.js'),1:()=>import('./generated/catalog-1.js'),2:()=>import('./generated/catalog-2.js'),3:()=>import('./generated/catalog-3.js'),
 4:()=>import('./generated/catalog-4.js'),5:()=>import('./generated/catalog-5.js'),6:()=>import('./generated/catalog-6.js'),7:()=>import('./generated/catalog-7.js'),
 8:()=>import('./generated/catalog-8.js'),9:()=>import('./generated/catalog-9.js'),10:()=>import('./generated/catalog-a.js'),11:()=>import('./generated/catalog-b.js'),
 12:()=>import('./generated/catalog-c.js'),13:()=>import('./generated/catalog-d.js'),14:()=>import('./generated/catalog-e.js'),15:()=>import('./generated/catalog-f.js')
 });
export type IconShardLoader=(bucket:number)=>Promise<Readonly<Record<string,IconAssetDefinition>>>;
const inert=(value:unknown):boolean=>{try{const stack=[{value,depth:0}],seen=new Set<object>();while(stack.length){const item=stack.pop()!,v=item.value;if(item.depth>8)return false;if(v===null||typeof v==='boolean'||typeof v==='number'&&Number.isFinite(v))continue;if(typeof v==='string'){if(v.length>32768)return false;continue;}if(!object(v)&&!Array.isArray(v))return false;const obj=v as object;if(seen.has(obj)||!Array.isArray(obj)&&Object.getPrototypeOf(obj)!==Object.prototype||Object.getOwnPropertySymbols(obj).length)return false;seen.add(obj);for(const[key,d]of Object.entries(Object.getOwnPropertyDescriptors(obj))){if(Array.isArray(obj)&&key==='length')continue;if(!d.enumerable||!Object.hasOwn(d,'value'))return false;stack.push({value:d.value as unknown,depth:item.depth+1});}}return true;}catch{return false;}};
const shapeTags=new Set(['path','circle','rect','line','ellipse','polyline','polygon']);
const shapeAttrs=new Set(['cx','cy','d','fill','height','points','r','rx','ry','width','x','x1','x2','y','y1','y2']);
export function validateIconAssetDefinition(value:unknown,expected:IconCatalogMetadata):value is IconAssetDefinition {
 if(!inert(value)||!object(value)||Object.keys(value).sort().join(',')!=='assetRef,catalogVersion,digest,name,provider,shapes'||value.name!==expected.name||value.assetRef!==expected.assetRef||value.catalogVersion!==expected.catalogVersion||value.provider!==expected.provider||value.digest!==expected.digest||!Array.isArray(value.shapes)||!value.shapes.length||value.shapes.length>64)return false;
 for(const shape of value.shapes){if(!Array.isArray(shape)||shape.length!==2||!shapeTags.has(shape[0] as string)||!object(shape[1]))return false;
  for(const[key,raw]of Object.entries(shape[1])){if(!shapeAttrs.has(key)||typeof raw!=='string'&&typeof raw!=='number')return false;const v=String(raw);
   if(key==='fill'){if(!['none','currentColor'].includes(v))return false;}
   else if(key==='d'){if(!/^[MmLlHhVvCcSsQqTtAaZzEe\d.,\s+-]+$/.test(v))return false;}
   else if(key==='points'){if(!/^[\d.,\s+eE-]+$/.test(v))return false;}
   else if(!Number.isFinite(Number(raw)))return false;
  }
 }
 return true;
}
export function createIconAssetLoader(load:IconShardLoader=async bucket=>{
 const module=await ICON_SHARD_LOADERS[bucket as keyof typeof ICON_SHARD_LOADERS]();
 return module.definitions as Readonly<Record<string,IconAssetDefinition>>;
}) {
 const cache=new Map<string,Promise<IconAssetResult>>();
 return Object.freeze({async load(value:unknown):Promise<IconAssetResult>{
  const ref=normalizeIconReference(value);if(!ref)return{status:'invalid-reference'};
  if(ref.catalogVersion!==ICON_CATALOG_VERSION)return{status:'unsupported-version'};
  const expected=metadataByRef.get(ref.assetRef);if(!expected)return{status:'missing'};
  const cached=cache.get(ref.assetRef);if(cached)return cached;
  const pending=(async():Promise<IconAssetResult>=>{try{const values=await load(expected.bucket),definition=values[ref.assetRef];
   if(!validateIconAssetDefinition(definition,expected))return{status:'unavailable'};
   const bytes=new TextEncoder().encode(JSON.stringify(definition.shapes));const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');if(hash!==expected.digest)return{status:'unavailable'};
   const immutable=Object.freeze({...definition,shapes:Object.freeze(definition.shapes.map(([tag,attrs])=>Object.freeze([tag,Object.freeze({...attrs})] as const)))});
   return Object.freeze({status:'ready',definition:immutable});
  }catch{return{status:'unavailable'};}})();
  cache.set(ref.assetRef,pending);const result=await pending;if(result.status!=='ready'&&cache.get(ref.assetRef)===pending)cache.delete(ref.assetRef);return result;
 },cachedCount:()=>cache.size});
}
const localLoader=createIconAssetLoader();
export const loadIconAsset=localLoader.load;
