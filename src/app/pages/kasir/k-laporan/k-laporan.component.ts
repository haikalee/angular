import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import { environment } from "src/environments/environment";
import * as moment from "moment";

@Component({
  selector: "app-k-laporan",
  templateUrl: "./k-laporan.component.html",
  styleUrls: ["./k-laporan.component.scss"],
})
export class KLaporanComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: DataTables.Settings;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  is_tampilkan: boolean;
  showForm: boolean;
  modelParam: { supplier };
  model: any = {};
  daterange: any = {};
  listSupplier: any;
  listPenjualan: any;
  jumlahPembelian: any;
  data: any;
  apiURL = environment.apiURL;
  options: any = {
    locale: { format: "YYYY-MM-DD" },
    alwaysShowCalendars: false,
  };

  constructor(private landaService: LandaService) {}

  ngOnInit(): void {
    this.pageTitle = "Laporan";
    this.breadCrumbItems = [
      {
        label: "Kasir",
      },
      {
        label: "Laporan",
        activate: true,
      },
    ];
    this.modelParam = {
      supplier: "",
    };
    this.listSupplier = [];
    this.data = [];
    this.jumlahPembelian = 0;
    this.empty();
    this.getSupplier();
  }

  index() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = "Laporan";
    this.isView = false;
    this.isEdit = false;
  }

  create() {
    this.showForm = !this.showForm;
    this.pageTitle = "Tambah Laporan";
    this.isView = false;
    this.isEdit = false;
  }

  view(val) {
    this.empty();
    this.model = val;
    this.isView = true;
    this.isEdit = false;
    this.pageTitle = "View";
  }

  edit(val) {
    this.empty();
    this.model = val;
    this.isView = false;
    this.isEdit = true;
    this.pageTitle = "Edit";
  }

  reloadDataTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  selectedDate(value: any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }

  tampil(is_export, is_print) {
    if (this.model.supplier_id !== null && this.model.supplier_id !== null) {
      const data = {
        periode_mulai: "null",
        periode_selesai: "null",
        id_supplier: [this.model.id_supplier],
        is_export,
        is_print,
      };
      if (
        this.daterange.start !== undefined &&
        this.daterange.end !== undefined
      ) {
        data.periode_mulai = moment(this.daterange.start).format("YYYY-MM-DD");
        data.periode_selesai = moment(this.daterange.end).format("YYYY-MM-DD");
      }
      if (is_export === 1 || is_print === 1) {
        window.open(
          this.apiURL + "/l_pembelian/index?" + $.param(data),
          "_blank"
        );
      } else {
        this.landaService
          .DataGet("/l_pembelian/index", data)
          .subscribe((res: any) => {
            if (res.status_code === 200) {
              this.listPenjualan = res.data.list.list;
              this.is_tampilkan = true;
              this.model.total = this.listPenjualan[0].total;
            } else {
              this.is_tampilkan = false;
            }
          });
      }
    } else {
      this.landaService.alertError(
        "Mohon Maaf",
        "Provinsi dan Kabupaten harus diisi !"
      );
    }
  }

  getSupplier() {
    this.landaService.DataGet("/m_supplier/index", {}).subscribe((res: any) => {
      this.listSupplier = res.data.list;
    });
  }

  empty() {
    this.model = {};
  }
}
