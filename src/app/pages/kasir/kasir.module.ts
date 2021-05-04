import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UiSwitchModule } from "ngx-ui-switch";
import { ArchwizardModule } from "angular-archwizard";
import { NgxMaskModule, IConfig } from "ngx-mask";
import { Daterangepicker } from "ng2-daterangepicker";
import { CKEditorModule } from "ckeditor4-angular";

import {
  NgbAlertModule,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbPaginationModule,
  NgbNavModule,
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { UIModule } from "../../layouts/shared/ui/ui.module";
import { KasirRoutingModule } from "./kasir-routing.module";

import { KBarangComponent } from "./k-barang/k-barang.component";
import { KPembelianComponent } from "./k-pembelian/k-pembelian.component";
import { KPenjualanComponent } from "./k-penjualan/k-penjualan.component";
import { KCustomerComponent } from "./k-customer/k-customer.component";
import { KLaporanComponent } from './k-laporan/k-laporan.component';

export const options: Partial<IConfig> = {
  thousandSeparator: ".",
};

@NgModule({
  declarations: [
    KBarangComponent,
    KPembelianComponent,
    KPenjualanComponent,
    KCustomerComponent,
    KLaporanComponent,
  ],
  imports: [
    CommonModule,
    KasirRoutingModule,
    FormsModule,
    UIModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbAccordionModule,
    NgSelectModule,
    UiSwitchModule,
    NgbCollapseModule,
    NgbModule,
    ReactiveFormsModule,
    ArchwizardModule,
    DataTablesModule,
    Daterangepicker,
    CKEditorModule,
    NgxMaskModule.forRoot(options),
  ],
})
export class KasirModule {}
