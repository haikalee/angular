import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { KBarangComponent } from "./k-barang/k-barang.component";
import { KCustomerComponent } from "./k-customer/k-customer.component";
import { KLaporanComponent } from "./k-laporan/k-laporan.component";
import { KPembelianComponent } from "./k-pembelian/k-pembelian.component";
import { KPenjualanComponent } from "./k-penjualan/k-penjualan.component";

const routes: Routes = [
  {
    path: "barang",
    component: KBarangComponent,
  },
  {
    path: "pembelian",
    component: KPembelianComponent,
  },
  {
    path: "penjualan",
    component: KPenjualanComponent,
  },
  {
    path: "customer",
    component: KCustomerComponent,
  },
  {
    path: "laporan",
    component: KLaporanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KasirRoutingModule {}
