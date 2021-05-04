import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../core/guards/auth.guard";
import { DashboardComponent } from "./dashboard/dashboard.component";

const routes: Routes = [
  { path: "", redirectTo: "home" },
  { path: "home", component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: "master",
    loadChildren: () =>
      import("./master/master.module").then((m) => m.MasterModule),
    canActivate: [AuthGuard],
  },
  {
    path: "mahasiswa",
    loadChildren: () =>
      import("./data-mahasiswa/data-mahasiswa.module").then(
        (m) => m.DataMahasiswaModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "pelanggan",
    loadChildren: () =>
      import("./pelanggan/pelanggan.module").then((m) => m.PelangganModule),
    canActivate: [AuthGuard],
  },
  {
    path: "transaksi",
    loadChildren: () =>
      import("./transaksi/transaksi.module").then((m) => m.TransaksiModule),
    canActivate: [AuthGuard],
  },
  {
    path: "kasir",
    loadChildren: () =>
      import("./kasir/kasir.module").then((m) => m.KasirModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
