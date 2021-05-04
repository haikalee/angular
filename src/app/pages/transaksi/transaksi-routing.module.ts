import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PembelianComponent } from "./pembelian/pembelian.component";

const routes: Routes = [
  {
    path: "pembelian",
    component: PembelianComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransaksiRoutingModule {}
