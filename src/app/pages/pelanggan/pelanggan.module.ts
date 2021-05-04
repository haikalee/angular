import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PelangganRoutingModule } from "./pelanggan-routing.module";
import { IndexComponent } from "./index/index.component";

@NgModule({
  declarations: [IndexComponent],
  imports: [CommonModule, PelangganRoutingModule],
})
export class PelangganModule {}
