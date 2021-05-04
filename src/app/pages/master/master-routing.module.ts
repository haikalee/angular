import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CobaComponent } from "./coba/coba.component";

import { PenggunaComponent } from "./pengguna/pengguna.component";
import { MBarangComponent } from "./m-barang/m-barang.component";
import { MHpComponent } from "./m-hp/m-hp.component";
import { MKonsumenComponent } from "./m-konsumen/m-konsumen.component";
import { MMerekComponent } from "./m-merek/m-merek.component";
import { MSupplierComponent } from "./m-supplier/m-supplier.component";

const routes: Routes = [
  {
    path: "pengguna",
    component: PenggunaComponent,
  },
  {
    path: "coba",
    component: CobaComponent,
  },
  {
    path: "barang",
    component: MBarangComponent,
  },
  {
    path: "hp",
    component: MHpComponent,
  },
  {
    path: "konsumen",
    component: MKonsumenComponent,
  },
  {
    path: "merek",
    component: MMerekComponent,
  },
  {
    path: "supplier",
    component: MSupplierComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
