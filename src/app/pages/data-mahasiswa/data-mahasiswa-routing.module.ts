import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MahasiswaComponent } from "./mahasiswa/mahasiswa.component";

const routes: Routes = [
  {
    path: "mahasiswa",
    component: MahasiswaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataMahasiswaRoutingModule {}
