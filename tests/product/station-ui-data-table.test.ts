import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DataTable } from "../../packages/ui-core/index.js";
const columns = [{ id: "name", label: "Name", cell: (r: {id:string;name:string}) => r.name }];
const rows = [{id:"one",name:"<script>unsafe</script>"}];
const draw = (props: Record<string,unknown>) => renderToStaticMarkup(createElement(DataTable, {label:"Files",rows,columns,rowKey:(r:{id:string})=>r.id,...props}));
test("data table has semantic table headings, selected row and escaped cell",()=>{
 const html=draw({selectedKey:"one",onSelect:()=>{}});
 assert.match(html,/aria-label="Files"/);assert.match(html,/scope="col"/);
 assert.match(html,/aria-selected="true"/);assert.match(html,/&lt;script&gt;unsafe/);
 assert.doesNotMatch(html,/<script>/);
});
test("data table announces loading, error and empty independently",()=>{
 assert.match(draw({state:"loading"}),/aria-busy="true"/);
 assert.match(draw({state:"error",message:"Source unavailable"}),/role="alert"/);
 const empty=renderToStaticMarkup(createElement(DataTable,{label:"Empty",rows:[],columns,rowKey:(r:{id:string})=>r.id}));
 assert.match(empty,/No results/);
});
test("data table rejects malformed column and row identities",()=>{
 assert.throws(()=>draw({columns:[...columns,...columns]}),/unique nonempty/);
 assert.throws(()=>draw({rows:[...rows,...rows]}),/unique nonempty row keys/);
 assert.throws(()=>draw({selectedKey:"missing"}),/selectedKey must exist/);
});
